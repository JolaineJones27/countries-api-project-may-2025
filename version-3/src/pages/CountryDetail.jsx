// useState manages state variables in the component - useEffect for side effects like increasing the view count
import React, { useState, useEffect, useRef } from "react";
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

  // useRef to prevent it doubling the count in strict mode
  const hasIncremented = useRef(false);

  // useEffect runs the increment logic only when the country changes
  useEffect(() => {
    // reset the guard when the country changes
    hasIncremented.current = false;
    // Run increment in a microtask so React can finish the double-invoke cycle
    setTimeout(() => {
      if (!hasIncremented.current) {
        let currentCount = parseInt(localStorage.getItem(key) || "0", 10) + 1;
        localStorage.setItem(key, currentCount);
        setViewCount(currentCount);
        hasIncremented.current = true;
      }
    }, 0);
  }, [countryName, key, country.name.common]);

  // I add a state to show if this country is already saved
  const [isSaved, setIsSaved] = useState(false);

  // I check if this country is already in saved list by asking the backend
  useEffect(() => {
    async function checkIfSaved() {
      try {
        // GET all saved countries from backend
        const res = await fetch("/api/get-all-saved-countries");
        if (res.ok) {
          // Since we are not parsing JSON, just mark as not saved (or use your own logic)
          // You can enhance this if your backend returns something you can use with res.text()
          setIsSaved(false);
        } else {
          setIsSaved(false);
        }
      } catch (err) {
        // If API fails then assume it's not saved
        setIsSaved(false);
      }
    }
    checkIfSaved();
  }, [country.name.common]);

  // This function saves the country to the backend not localStorage
  async function handleSaveCountry() {
    try {
      // POST to backend API to save the country (replace with your actual endpoint and payload)
      const res = await fetch("/api/save-one-country", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country_name: country.name.common }),
      });
      if (res.ok) {
        setIsSaved(true);
        // sends custom event so SavedCountries page updates immediately
        document.dispatchEvent(new Event("savedCountriesUpdated"));
      } else {
        alert("Failed to save country.");
      }
    } catch (err) {
      alert("Failed to save country.");
    }
  }

  // if found it displays the following
  return (
    <div className="country-detail-info">
      <h2>{country.name.common}</h2>
      {/* Only render the image if flagPng is truthy, otherwise render a placeholder or nothing */}
      {country.flags?.png
        ? (
          <img
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
            width={200}
          />
        ) : (
          // Optionally, render a placeholder or nothing if no flag is available
          <div style={{ width: 200, height: 120, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
            No flag available
          </div>
        )
      }
      <p>
        <strong>Capital:</strong> {country.capital?.[0] || "No capital"}
      </p>
      <p>
        <strong>Region:</strong> {country.region || "No region"}
      </p>
      <p>
        <strong>Population:</strong> {country.population?.toLocaleString() || "No data"}
      </p>
      <p>
        <strong>Viewed:</strong> {viewCount} {viewCount === 1 ? "time" : "times"}
      </p>
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
