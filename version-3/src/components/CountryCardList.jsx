import React from "react";
import { Link } from "react-router-dom";
import CountryCard from "./CountryCard";

// I'm declaring a component called CountryCardList that takes a prop called data which is an array of country objects
function CountryCardList({ data, withLinks = true }) {
  // I start the JSX that will show
  return (
    // div for styling
    <div className="countries-list">
      {/* // I loop thru each country in the data array */}
      {data.map((country, idx) => {
        const card = <CountryCard key={country.cca3 || country.name?.common || idx} country={country} />;
        // Only wrap in Link if withLinks is true
        return withLinks ? (
          <Link
            key={country.cca3 || country.name?.common || idx}
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
