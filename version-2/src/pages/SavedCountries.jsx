// useState manages state variables in the component - useEffect checks for localStorage
import React, { useState, useEffect } from "react";
import CountryCardList from "../components/CountryCardList";

// I create a component called SavedCountries
function SavedCountries() {
  // I create a seperate state variable for each input using the hook useState
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [message, setMessage] = useState("");
  // tracks if user has submitted
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // useEffect runs when the component is created and inserted into the DOM for the first time, checks localStorage for user profile
  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    // if the profile is there, do this: 
    if (storedProfile) {
      // parses the saved JSON string and gets the values
      const { name, email, country, message } = JSON.parse(storedProfile);
      setName(name);
      setEmail(email);
      setUserCountry(country);
      setMessage(message);
      setHasSubmitted(true);
    }
  }, []);

  // This function runs when the form is submitted
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

  // --- Saved Countries state ---
  // I make a state variable to store the saved countries
  const [savedCountries, setSavedCountries] = useState([]);

  // useEffect runs when the component is created and inserted into the DOM for the first time, checks localStorage for saved countries
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
       {/* Form Section  */}
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>
        <h2>My Profile</h2>
        {hasSubmitted ? (
          <div>
            <h3>Welcome, {name}!</h3>
            <p>
              <strong>Email:</strong> {email}<br />
              <strong>Country:</strong> {userCountry}<br />
              <strong>Bio:</strong> {message}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label>
                Full Name
                <input
                  type="text"
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
        )}
      </div>

      {/* --- Saved Countries Section --- */}
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

// export so I can use elsewhere
export default SavedCountries;

// https://legacy.reactjs.org/docs/forms.html
// https://dev.to/ajones_codes/a-better-guide-to-forms-in-react-47f0
