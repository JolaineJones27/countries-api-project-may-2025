// useState manages state variables in the component - useEffect checks for profile on mount
import React, { useState, useEffect } from 'react';
// import to show a list of countries
import CountryCardList from '../components/CountryCardList';

// I create a component called SavedCountries
function SavedCountries() {
  // I create a separate state variable for each input using the useState hook
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userCountry, setUserCountry] = useState('');
  const [message, setMessage] = useState('');
  // tracks if user has submitted
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // I make a state variable to store the saved countries fetched from backend
  const [savedCountryNames, setSavedCountryNames] = useState([]); // just names from other API
  const [savedCountries, setSavedCountries] = useState([]); // full country objects from REST Countries API
  // I add a loading state so I can show a loading message while fetching
  const [loading, setLoading] = useState(true);

  // 2. RETRIEVING FORM DATA:
  // On mount, GET the newest user profile from backend
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/get-newest-user');
        if (response.ok) {
          const data = await response.json();
          // Defensive: check structure
          if (data && data.name) {
            setName(data.name);
            setEmail(data.email || '');
            setUserCountry(data.countryOfOrigin || data.country || '');
            setMessage(data.bio || data.message || '');
            setHasSubmitted(true);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user profile', err);
      }
    }
    fetchProfile();
  }, []);

  // 1b. STORING FORM DATA:
  // This function runs when the form is submitted. This POSTs the form data to the backend and updates state to true to indicate the profile has been saved.
  async function handleSubmit(event) {
    // Stops the page from reloading
    event.preventDefault();
    // Sends user info to backend
    const userProfile = {
      name,
      email,
      countryOfOrigin: userCountry,
      bio: message,
    };
    try {
      const response = await fetch('/api/add-one-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });
      if (response.ok) {
        // After POST, fetch newest user to update UI (in case backend transforms data)
        const newUser = await response.json();
        setName(newUser.name);
        setEmail(newUser.email || '');
        setUserCountry(newUser.countryOfOrigin || newUser.country || '');
        setMessage(newUser.bio || newUser.message || '');
        setHasSubmitted(true);
      } else {
        // Optionally handle error (e.g., show a message)
        setHasSubmitted(true); // Still show welcome for demo
      }
    } catch (err) {
      console.error('Failed to submit user profile', err);
      // Optionally show an error message
    }
  }

  // useEffect runs when the page loads, fetches saved country names from the backend (instructor's API)
  useEffect(() => {
    // function to load saved country names from backend API
    async function loadSavedCountryNames() {
      setLoading(true); // show loading while fetching
      try {
        // GET request to the class API for saved country names
        const response = await fetch('/api/get-all-saved-countries');
        const data = await response.json();

        // API should return an array of country names or objects with a .country_name property
        // Defensive: if not, try .countries or fallback to []
        const namesArray = Array.isArray(data) ? data : data.countries || [];
        setSavedCountryNames(namesArray);

        // Debug log to see what the backend returns
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

    // Cleanup event listener
    return () => {
      document.removeEventListener(
        'savedCountriesUpdated',
        handleCountriesUpdated
      );
    };
  }, []);

  // For each saved country name, fetch full country details from REST Countries API
  useEffect(() => {
    // If there are no saved country names, clear savedCountries and return
    if (!savedCountryNames || savedCountryNames.length === 0) {
      setSavedCountries([]);
      return;
    }

    // This function uses a for loop to fetch each country detail
    async function fetchFullCountryData() {
      setLoading(true);
      const countryDetails = [];
      for (let i = 0; i < savedCountryNames.length; i++) {
        // Defensive extraction: works for {country_name: "Afghanistan"}, {country: "Afghanistan"}, {name: "Afghanistan"}, or "Afghanistan"
        const nameObj = savedCountryNames[i];
        // This line ensures we extract the correct country name, no matter the structure
        const countryName =
          typeof nameObj === 'string'
            ? nameObj
            : nameObj &&
              (nameObj.country_name || nameObj.country || nameObj.name);
        if (!countryName) {
          // Skip or push a placeholder if you want to keep the grid aligned
          console.warn('Skipping undefined country name at index', i, nameObj);
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
          // REST Countries API returns an array, take the first match if available
          if (Array.isArray(data) && data.length > 0) {
            countryDetails.push(data[0]);
          } else {
            // If not found, push a placeholder object so the grid stays aligned
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
                    // value and onChange props connect them to a state variable
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
        {/* If loading, show loading message */}
        {loading ? (
          <p>Loading saved countries...</p>
        ) : savedCountries.length === 0 ? (
          <p>You have not saved any countries.</p>
        ) : (
          // I use my CountryCardList to show all saved countries
          // Now passing full country objects from REST Countries API
          <CountryCardList data={savedCountries} />
        )}
      </div>
    </div>
  );
}

export default SavedCountries;

// https://legacy.reactjs.org/docs/forms.html
// https://dev.to/ajones_codes/a-better-guide-to-forms-in-react-47f0
