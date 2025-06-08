import React from "react";
// import for client routing
import { Link } from "react-router-dom";
// component to show each country info
import CountryCard from "./CountryCard";

// I'm declaring a component called CountryCardList that takes a 'data' prop (the array of country objects) - an option of withLinks prop set to true controls if cards are in links
function CountryCardList({ data, withLinks = true }) {
  // I start the JSX that will render the list of countries
  return (
    // div for styling
    <div className="countries-list">
      {/* // map is for rendering a list from arrays - so I loop thru each country in the data array */}
      {data.map((country, idx) => {
        const card = <CountryCard key={country.cca3 || country.name?.common || idx} country={country} />;
        // Only wrap in link if withLinks is true
        return withLinks ? (
          <Link
            key={country.cca3 || country.name?.common || idx}
            // handles special characters in the countries names (MDN web docs)
            to={`/country/${encodeURIComponent(country.name?.common)}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {card}
          </Link>
        ) : (
          card
        );
      })}
    </div>
  );
}

export default CountryCardList;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
