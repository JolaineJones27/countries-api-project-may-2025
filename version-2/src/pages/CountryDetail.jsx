console.log("CountryDetail module loaded");
// useState is for managing local state in the component
import React, { useState, useEffect, useRef } from "react";
// useParams gives access to URL parameters like the country name from the route
import { useParams } from "react-router-dom";

// I create a component called CountryDetail that receives a list of countries as a prop
function CountryDetail({ countries }) {
  console.log("CountryDetail component rendering. Countries prop:", countries);
  // uses the useParams hook to get the name from the Url
  const { countryName } = useParams();

  // if the countries list hasn't loaded yet it shows a message
  if (!countries || countries.length === 0) {
    console.log("Countries not loaded yet:", countries);
    return <div>Loading...</div>;
  }

  // looks thru the countries list to find the country whose name matches the one in the URL ignoring case
  const country = countries.find(
    (c) => c.name.common.toLowerCase() === countryName.toLowerCase()
  );

  // if no country is found, it will give a message
  if (!country) {
    console.log(`Country "${countryName}" not found in countries list.`);
    return <div>Country not found.</div>;
  }

  // key for localStorage: unique for each country
  const key = `country-view-count-${country.name.common}`;

  // useState to store the current view count (initialize from localStorage)
  const [viewCount, setViewCount] = useState(() =>
    parseInt(localStorage.getItem(key) || "0", 10)
  );

  // useRef to prevent double-increment in React Strict Mode
  const hasIncremented = useRef(false);

  // useEffect runs the increment logic only when the country changes
  useEffect(() => {
    // Reset the guard when the country changes
    hasIncremented.current = false;
    // Run increment in a microtask so React can finish the double-invoke cycle
    setTimeout(() => {
      if (!hasIncremented.current) {
        let currentCount = parseInt(localStorage.getItem(key) || "0", 10) + 1;
        localStorage.setItem(key, currentCount);
        setViewCount(currentCount);
        hasIncremented.current = true;
        console.log(
          `Incremented viewCount for "${country.name.common}" to`,
          currentCount
        );
      }
    }, 0);
  }, [countryName, key, country.name.common]);

  
  // I add a state to show if this country is already saved
  const [isSaved, setIsSaved] = useState(false);

  // I check if this country is already in saved list on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedCountries") || "[]");
    setIsSaved(saved.some((c) => c.cca3 === country.cca3));
  }, [country.cca3]);

  // This function saves the country to localStorage
  function handleSaveCountry() {
    const saved = JSON.parse(localStorage.getItem("savedCountries") || "[]");
    // Only add if not already saved
    if (!saved.some((c) => c.cca3 === country.cca3)) {
      saved.push(country);
      localStorage.setItem("savedCountries", JSON.stringify(saved));
      setIsSaved(true);

      // Dispatch custom event so SavedCountries page updates immediately
      // This notifies any listener (like your SavedCountries page) to reload the saved countries list
      window.dispatchEvent(new Event("savedCountriesUpdated"));
    }
  }

  // if found it displays the following
  return (
    <div className="country-detail-info">
      <h2>{country.name.common}</h2>
      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width={200}
      />
      <p>
        <strong>Capital:</strong> {country.capital?.[0]}
      </p>
      <p>
        <strong>Region:</strong> {country.region}
      </p>
      <p>
        <strong>Population:</strong> {country.population.toLocaleString()}
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

// exports so it can be used elsewhere
export default CountryDetail;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR
