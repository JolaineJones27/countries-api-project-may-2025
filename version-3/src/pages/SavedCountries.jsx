// useState lets me create state variables in the component and the page will update if I change them - useEffect runs code after the component mounts - (just truly understood what this word means again ("mount")) - it means shows up for the first time ) - with a empty array at the end it will only run once after it first renders
import React, { useState, useEffect } from 'react';

// import to later show a list of countries 
import CountryCardList from '../components/CountryCardList';

// defining my main component called SavedCountries that shows a list of cards
function SavedCountries() {

  // I create a separate state variable for each input using the useState hook - start as empty strings because they havent filled out the form yet
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userCountry, setUserCountry] = useState('');
  const [message, setMessage] = useState('');

  // tracks if user has submitted - starts as the boolean false saying they havent submitted yet
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // I make state variables to store the saved countries fetched from backend - savedCountryNames is a list from the backend and its empty at first 
  const [savedCountryNames, setSavedCountryNames] = useState([]); 
  // holds the full data to render - empty at first too
  const [savedCountries, setSavedCountries] = useState([]); 
  // I add a loading state so I can show a loading message while its loading - message shows until the fetching is done
  const [loading, setLoading] = useState(true);

  // 2. RETRIEVING FORM DATA:
  // runs once the components mounts (runs for the first time)
  useEffect(() => {
    // I check localStorage first to see if this user already submitted the form
    const alreadySubmitted = localStorage.getItem('hasSubmitted');
    if (alreadySubmitted) {
      // If already submitted the form doesnt show again
      setHasSubmitted(true);
      return;
    }
    // If not, fetch the latest user profile from backend (for display, not to hide the form)
    async function fetchProfile() {
      try {
        const response = await fetch('/api/get-newest-user');
        if (response.ok) {
          const data = await response.json();
          // Defensive to check structure - it checks for data.name before updating the state (Geeksforgeeks)
          setName(data.name || '');
          setEmail(data.email || '');
          setUserCountry(data.country_name || data.country || '');
          setMessage(data.bio || data.message || '');
        }
      } catch (err) {
        console.error('Failed to fetch user profile', err);
      }
    }
    fetchProfile();
  }, []);

  // 1b. STORING FORM DATA:
  // This function runs when the form is submitted - POSTs the form data to the backend and updates state to true to show that the profile has been saved
  async function handleSubmit(event) {
    // Stops the page from reloading
    event.preventDefault();
    // Sends user info to backend
    const userProfile = {
      name,
      email,
      country_name: userCountry,
      bio: message,
    };
    try {
      const response = await fetch('/api/add-one-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });
      if (response.ok) {
        // After POST fetch newest user to update
        const newUser = await response.json();
        setName(newUser.name);
        setEmail(newUser.email || '');
        setUserCountry(newUser.country_name || newUser.country || '');
        setMessage(newUser.bio || newUser.message || '');
        // Set submitted state and remember in localStorage so form doesn't reappear for this visitor
        setHasSubmitted(true);
        localStorage.setItem('hasSubmitted', 'true');
      } else {
        // handle error - shows a message
        console.log('POST failed', response.status, await response.text());
        alert('Failed to save profile. Please try again.');
      }
    } catch (err) {
      console.error('Failed to submit user profile', err);
      alert('Failed to save profile. Please try again.');
    }
  }

  // useEffect runs when the page loads - fetches saved country names from the API
  useEffect(() => {
    // function to load saved country names from API
    async function loadSavedCountryNames() {
      setLoading(true); 
      try {
        // GET request to the API for saved country names
        const response = await fetch('/api/get-all-saved-countries');
        const data = await response.json();

        // API should return an array of country names or objects with a country_name property
        const namesArray = Array.isArray(data) ? data : data.countries || [];
        setSavedCountryNames(namesArray);

        // Debug - to see what the backend returns
        console.log('Fetched country names from API:', namesArray);
      } catch (err) {
        console.error('Failed to fetch saved country names', err);
        setSavedCountryNames([]);
      }
      setLoading(false);
    }

    // Initial load - fetch the latest country names when the page loads
    loadSavedCountryNames();

    // Listen for the custom event so this page updates if a country is saved from CountryDetail
    function handleCountriesUpdated() {
      loadSavedCountryNames();
    }
    document.addEventListener('savedCountriesUpdated', handleCountriesUpdated);

    // Cleanup eventlistener
    return () => {
      document.removeEventListener(
        'savedCountriesUpdated',
        handleCountriesUpdated
      );
    };
  }, []);

  // For each saved country name I fetch the full country details from REST Countries API
  useEffect(() => {
    // If there are no saved country names it clears savedCountries and returns
    if (!savedCountryNames || savedCountryNames.length === 0) {
      setSavedCountries([]);
      return;
    }

    // This function uses a for loop to fetch each country detail
    async function fetchFullCountryData() {
      setLoading(true);
      const countryDetails = [];
      for (let i = 0; i < savedCountryNames.length; i++) {
        // defensive in case there is messed up data 
        const nameObj = savedCountryNames[i];
        // gets the correct country name no matter the structure - I thought this would help
        const countryName =
          typeof nameObj === 'string'
            ? nameObj
            : nameObj &&
              (nameObj.country_name || nameObj.country || nameObj.name);
        if (!countryName) {
          continue;
        }
        try {
          // REST Countries API expects the name in the URL
          const response = await fetch(
            `https://restcountries.com/v3.1/name/${encodeURIComponent(
              countryName
            )}?fullText=true`
          );
          const data = await response.json();
          // REST Countries API returns an array and takes the first match
          if (Array.isArray(data) && data.length > 0) {
            countryDetails.push(data[0]);
          } else {
            // If not found use placeholder object so the grid is aligned
            countryDetails.push({
              name: { common: countryName },
              capital: ['No capital'],
              region: 'No region',
              population: 'No data',
              flags: { png: null },
            });
          }
        } catch (err) {
          countryDetails.push({
            name: { common: countryName },
            capital: ['No capital'],
            region: 'No region',
            population: 'No data',
            flags: { png: null },
          });
        }
      }
      setSavedCountries(countryDetails);
      setLoading(false);
    }
    fetchFullCountryData();
  }, [savedCountryNames]);

  return (
    <div>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        {/* // 3. RENDERING FORM DATA */}
        {/* // using the hasSubmitted state to decide what to show - if hasSubmitted is true the welcome message displays, if not the form pops up */}
        {hasSubmitted ? (
          <div>
            <h2>Welcome, {name}!</h2>
          </div>
        ) : (
          <>
            <h2 className="profile-heading">My Profile</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label>
                  Full Name
                  {/* 1. storing user data  */}
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    style={{ display: 'block', width: '100%', padding: '8px' }}
                    required
                  />
                </label>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label>
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    style={{ display: 'block', width: '100%', padding: '8px' }}
                    required
                  />
                </label>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label>
                  Country of Origin
                  <input
                    type="text"
                    value={userCountry}
                    onChange={(e) => setUserCountry(e.target.value)}
                    placeholder="Enter your country"
                    style={{ display: 'block', width: '100%', padding: '8px' }}
                    required
                  />
                </label>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label>
                  Bio
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us something..."
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px',
                      minHeight: '56px',
                    }}
                    required
                  />
                </label>
              </div>
              <button type="submit" style={{ padding: '10px 24px' }}>
                Submit
              </button>
            </form>
          </>
        )}
      </div>
      <div style={{ marginTop: '2rem' }}>
        <h2>Saved Countries</h2>
        {/* If loading show loading message */}
        {loading ? (
          <p>Loading saved countries...</p>
        ) : savedCountries.length === 0 ? (
          <p>You have not saved any countries.</p>
        ) : (
          <CountryCardList data={savedCountries} />
        )}
      </div>
    </div>
  );
}

export default SavedCountries;

// https://legacy.reactjs.org/docs/forms.html
// https://dev.to/ajones_codes/a-better-guide-to-forms-in-react-47f0
// https://www.geeksforgeeks.org/defensive-programming-in-r/
