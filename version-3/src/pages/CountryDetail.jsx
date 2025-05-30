// useState is for managing local state (data that I can change) in the component - useEffect is for running side effects when something else happens first (like when the page first loads) - useRef to make it not double the number count
import React, { useState, useEffect, useRef } from "react";
// useParams gives access to URL parameters like the country name from the route
import { useParams } from "react-router-dom";

// I create a component called CountryDetail that receives a list of countries as a prop
function CountryDetail({ countries }) {
  // uses the useParams hook to get the name from the Url
  const { countryName } = useParams();

  // 2. ***** I added this to use POST request ****** it's a state to store the count and it starts as null so I can show 'Loading' before the API returns - because sometimes it takes awhile for the count to render
  const [viewCount, setViewCount] = useState(null);

  
  // for saved countries: I use a state to show if this country is already saved
  const [isSaved, setIsSaved] = useState(false);

  // added because my count was doubling - it gives the value without re rendering when it changes
  const hasFetched = useRef(false);

  // 3. ***** I added this to use POST request ****** I'm calling it in a useEffect
  useEffect(() => {
    //  my POST request to update and get the count - it sends the POST request to my API and gets the count - it parses the response and updates with the new count - if there is an error, it says 0 as the count, sets viewCount to null before fetching to show it's loading
    const updateCount = async () => {
      try {
        const response = await fetch("/api/update-one-country-count", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            country_name: country.name.common, 
          }),
        });
        const text = await response.text();
        console.log("Raw API response:", text, "Type:", typeof text);
        let count;
        try {
          const data = JSON.parse(text);
          if (typeof data === 'object' && data !== null) {
            if ('count' in data) {
              count = Number(data.count);
            } else if ('newCount' in data) {
              count = Number(data.newCount);
            } else {
              count = 0;
            }
          } else if (!isNaN(Number(data))) {
            count = Number(data);
          } else {
            count = 0;
          }
        } catch (e) {
          // If it's not JSON, try to parse as a number directly (using a locigiacl NOT)
          count = !isNaN(Number(text)) ? Number(text) : 0;
        }
        console.log("Parsed count:", count);
        setViewCount(isNaN(count) ? 0 : count);
      } catch (err) {
        console.error("Failed to update/get country count", err);
        setViewCount(0);
      }
    };
    // it was counting double numbers - tracks if its already been called per github link below
    if (hasFetched.current) return; 
  hasFetched.current = true;

    // Set to loading before fetching
    setViewCount(null);
    updateCount();
  }, [countryName, countries]);

  
  // Log viewCount changes to see when it updates - helps with debugging
  useEffect(() => {
    console.log("viewCount changed:", viewCount);
  }, [viewCount]);

  // I check if this country is already in saved list when it first appears on the screen - runs when countryname or countries changes - updates isSaved if saved already
  useEffect(() => {
    if (!countries || countries.length === 0) return;
    const country = countries.find(
      (c) => c.name.common.toLowerCase() === countryName.toLowerCase()
    );
    if (!country) return;
    const saved = JSON.parse(localStorage.getItem("savedCountries") || "[]");
    setIsSaved(saved.some((c) => c.cca3 === country.cca3));
  }, [countryName, countries]);

  // 1. ***** I REMOVED this to use POST request ****** old localStorage - key for each country, the useREF and useEffect that stored the count
  // const key = `country-view-count-${country.name.common}`;
  // const [viewCount, setViewCount] = useState(() =>
  //   parseInt(localStorage.getItem(key) || "0", 10)
  // );
  // const hasIncremented = useRef(false);
  // useEffect(() => {
  //   // Reset the guard when the country changes
  //   hasIncremented.current = false;
  //   // Run increment in a microtask so React can finish the double-invoke cycle
  //   setTimeout(() => {
  //     if (!hasIncremented.current) {
  //       let currentCount = parseInt(localStorage.getItem(key) || "0", 10) + 1;
  //       localStorage.setItem(key, currentCount);
  //       setViewCount(currentCount);
  //       hasIncremented.current = true;
  //       console.log(
  //         `Incremented viewCount for "${country.name.common}" to`,
  //         currentCount
  //       );
  //     }
  //   }, 0);
  // }, [countryName, key, country.name.common]);


  // conditional check - if the countries list hasn't loaded yet it shows a message - the ! is the logical NOT operator that checks if it's loaaded - the || (OR operator) meaning if either side is true then it's true - then it checks for an empty array (no elements)
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
    // console.log(`Country "${countryName}" not found in countries list.`);
    return <div>Country not found.</div>;
  }

  // for SavedCountries part - still using localStorage
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

  // ***** I ADDED so it will log on every render to help debug *****
  console.log("Rendering CountryDetail, viewCount:", viewCount);

  // it displays the following
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
        {/* 4. ***** I added this to use POST request - to render the count in my jsx - === null ? is a ternary operator for if/else if - if null it says Loading because the count hasnt been fetched yet - or it shows the actual count - then using a template literal it shows the number in correct grammar*/}
        <strong>Viewed:</strong>{" "}
        {viewCount === null
          ? "Loading..."
          : `${viewCount} ${viewCount === 1 ? "time" : "times"}`}
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
// https://github.com/looker-open-source/looker-explore-assistant/blob/main/explore-assistant-extension/src/hooks/useBigQueryExamples.ts