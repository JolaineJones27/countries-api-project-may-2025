// useState lets me add state variables that can be changed in the component - useEffect for side effects like increasing the view count - useRef lets me keep a value without the component re rendering when changed
import React, { useState, useEffect, useRef } from "react";
// useParams lets me get names from the URL
import { useParams } from "react-router-dom";

// I create a component called CountryDetail that receives a list of countries as a prop
function CountryDetail({ countries }) {
  // uses the useParams hook to get the name from the Url
  const { countryName } = useParams();

  // Defensive - prevents errors if the data isn't loaded and shows a message
  if (!countries || countries.length === 0) {
    return <div>Loading...</div>;
  }

  // looks through the countries list to find the country whose name matches the one in the URL ignoring the case (A or a)
  const country = countries.find(
    (c) => c.name?.common?.toLowerCase() === countryName?.toLowerCase()
  );

  // if no country is found it will give a message
  if (!country) {
    return <div>Country not found.</div>;
  }

  // key for localStorage - different for each country
  const key = `country-view-count-${country.name.common}`;

  // useState to store the current view count - from localStorage
  const [viewCount, setViewCount] = useState(() =>
    parseInt(localStorage.getItem(key) || "0", 10)
  );

  // made a variable to see if the count has already gone up - useRef to prevent it from added the count twice in strict mode
  const hasIncremented = useRef(false);

  // useEffect for managing the counter
  // useEffect runs the when the country changes
  useEffect(() => {
    // reset the variable when to see if the count has already gone up
    hasIncremented.current = false;
    // delay so that everything else runs first
    setTimeout(() => {
      // if it hasn't increased, run this code
      if (!hasIncremented.current) {
        // looks up the count in local storage - if there is no count, make it 0 - the 10 tells it to use decimal (0-9) - if theres a count already there then add one more to it
        let currentCount = parseInt(localStorage.getItem(key) || "0", 10) + 1;
        // saves the new count back in local storage
        localStorage.setItem(key, currentCount);
        // updates the count to the page
        setViewCount(currentCount);
        // prevents double counting
        hasIncremented.current = true;
      }
    }, 0);
    // variables countryName and key and the property from the country object - if these values change it runs the useEffect again
  }, [countryName, key, country.name.common]);

  // I add a state to show if this country is already saved - beginning with the boolen false
  const [isSaved, setIsSaved] = useState(false);

  // useEffect to check if this country is already in saved list by asking the backend
  useEffect(() => {
   // makes a async function that checks the API for the saved status
    async function checkIfSaved() {
      // try is a catch block to handle errors for when it does things like during the API call
      try {
        // GETs all saved countries from backend
        const res = await fetch("/api/get-all-saved-countries");
        // checks if the HTML is OK - calls it to false 
        if (res.ok) {
          setIsSaved(false);
          // if the API fails it sets it to false
        } else {
          // I call the API call inside the effect - the useEffect runs the code afrter it renders
          setIsSaved(false);
        }
        // If API fails then it must not be saved 
      } catch (err) {
        setIsSaved(false);
      }
    }
    // runs the check function after it renders or the country changes
    checkIfSaved();
  }, [country.name.common]);

  // This function saves the country to the backend not localStorage - this function is using await to wait for request
  async function handleSaveCountry() {
   // try running code - if it fails the code will go to the catch code on line 104
    try {
      // POST to backend API to save the country - await pausing until the server responds
      const res = await fetch("/api/save-one-country", {
         // sending data to the server
        method: "POST",
        // sending JSON data
        headers: { "Content-Type": "application/json" },
        // data I'm sending 
        body: JSON.stringify({ country_name: country.name.common }),
      });
      // if the server responds with the boolean true it does this
      if (res.ok) {
        // updates the state and sets to the boolean true
        setIsSaved(true);
        // sends a custom event so SavedCountries page updates immediately
        document.dispatchEvent(new Event("savedCountriesUpdated"));
      } else {
        alert("Failed to save country.");
      }
      // if theres an error, it sends a message
    } catch (err) {
      alert("Failed to save country.");
    }
  }

  // if no error and is found it displays the following
  return (
    // for css 
    <div className="country-detail-info">
      <h2>{country.name.common}</h2>
      {/*  uses an optional chain (stackoverflow) - only render if flagPng is true (is there an image?) - otherwise render a placeholder or nothing */}
      {country.flags?.png
      // terenary operator - if the flag is there show it
        ? (
          <img
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
            width={200}
          />
        ) : (
          // if not there show "no flag available"
          <div style={{ width: 200, height: 120, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
            No flag available
          </div>
        )
      }
      {/* // the ? checks the first item in the capital array */}
      <p>
        <strong>Capital:</strong> {country.capital?.[0] || "No capital"}
      </p>
      {/* // shows the region */}
      <p>
        <strong>Region:</strong> {country.region || "No region"}
      </p>
      {/* // shows the population into a string with commas */}
      <p>
        <strong>Population:</strong> {country.population?.toLocaleString() || "No data"}
      </p>
       {/* // shows times veiwed and if its 1 it says "time" or if more it says "times" */}
      <p>
        <strong>Viewed:</strong> {viewCount} {viewCount === 1 ? "time" : "times"}
      </p>
      {/* // button to save country - when the user clicks it runs function handleSaveCountry - if already saved the button doesnt work and shows "saved" */}
      <button
        onClick={handleSaveCountry}
        disabled={isSaved}
        style={{ marginTop: "16px", padding: "10px 24px" }}
      >
        {isSaved ? "Saved" : "Save"}
      </button>
    </div>
  );
}

// exports so I can use elsewhere
export default CountryDetail;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
// https://www.w3schools.com/java/java_try_catch.asp
// https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events
// https://stackoverflow.com/questions/28514704/chaining-optionals-in-java-8