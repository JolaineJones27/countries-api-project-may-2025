// useState manages state variables in the component - useEffect checks for localStorage
import React, { useState, useEffect } from "react";
import CountryCardList from "../components/CountryCardList";

// I create a component called SavedCountries
function SavedCountries() {
  // I create a seperate state variable for each input using the useState hook
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [message, setMessage] = useState("");
  // tracks if user has submitted
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // I make a state variable to store the saved countries
  const [savedCountries, setSavedCountries] = useState([]);

  // 2. RETRIEVING FORM DATA:

  // the useEffect hook runs when the page loads, checks localStorage for user profile
  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    // if the profile is there, do this: 
    if (storedProfile) {
      // parses the saved JSON string and gets the values - it sets the state variable to true
      const { name } = JSON.parse(storedProfile);
      setName(name);
      setHasSubmitted(true);
    }
  }, []);
  
  // 1b. STORING FORM DATA:
  
  // This function runs when the form is submitted. This puts the form data in an object, then using stringify it converts to a string and saves it the the local storage with the key userProfile - it updates state to true to indicate the profile has been saved.
  function handleSubmit(event) {
    // Stops the page from reloading
    event.preventDefault();
    // Saves user info to localStorage
    const userProfile = {
      name,
      email,
      country: userCountry,
      message,
    };
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    setHasSubmitted(true); 
  }

  // useEffect runs when the page loads, checks localStorage for saved countries
  useEffect(() => {
    // function to load saved countries from localStorage
    function loadSavedCountries() {
      const saved = JSON.parse(localStorage.getItem("savedCountries") || "[]");
      setSavedCountries(saved);
    }
    // Initial load
    loadSavedCountries();

    // Listen for the custom event from CountryDetail and for storage changes from other tabs
    window.addEventListener("savedCountriesUpdated", loadSavedCountries);
    window.addEventListener("storage", loadSavedCountries);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("savedCountriesUpdated", loadSavedCountries);
      window.removeEventListener("storage", loadSavedCountries);
    };
  }, []);

  return (
    <div>
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>
       
       {/* // 3. RENDERING FORM DATA */}

        {/* // using the hasSubmitted state to decide what to show - if hasSubmitted is true the welcome message displays, if not the form pops up */}
        {hasSubmitted ? (
          <div>
            <h2>Welcome, {name}!</h2>
          </div>
        ) : (
          <>
            <h2 class="profile-heading">My Profile</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label>
                  Full Name
                  
                  {/* 1. STORING ALL USER DATA:  */}

                  {/* // Each input field is connected to a state variable. The values are updated. When the user submits, my handleSubmit function runs (line 33) */}
                  
                  <input
                    type="text"
                    // value and onChange props connect them to a state variable
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    style={{ display: "block", width: "100%", padding: "8px" }}
                    required
                  />
                </label>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label>
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    style={{ display: "block", width: "100%", padding: "8px" }}
                    required
                  />
                </label>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label>
                  Country
                  <input
                    type="text"
                    value={userCountry}
                    onChange={(e) => setUserCountry(e.target.value)}
                    placeholder="Enter your country"
                    style={{ display: "block", width: "100%", padding: "8px" }}
                    required
                  />
                </label>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label>
                  Message
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us something..."
                    style={{ display: "block", width: "100%", padding: "8px", minHeight: "56px" }}
                    required
                  />
                </label>
              </div>
              <button type="submit" style={{ padding: "10px 24px" }}>
                Submit
              </button>
            </form>
          </>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>Saved Countries</h2>
        {/* If there are no saved countries, show a message */}
        {savedCountries.length === 0 ? (
          <p>You have not saved any countries yet.</p>
        ) : (
          // I use my CountryCardList to show all saved countries
          <CountryCardList data={savedCountries} />
        )}
      </div>
    </div>
  );
}

export default SavedCountries;

// https://legacy.reactjs.org/docs/forms.html
// https://dev.to/ajones_codes/a-better-guide-to-forms-in-react-47f0
