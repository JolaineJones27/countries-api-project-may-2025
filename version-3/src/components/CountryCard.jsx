import React from 'react';
import '../App.css';

// Defines a component that accepts a country object as a prop
function CountryCard({ country }) {
  // optional chaining if missing it's undefined - the OR || operator gives a default value if the left side is false or null
  const name = country.name?.common || "No name";
  const capital = country.capital?.[0] || "No capital";
  const region = country.region || "No region";
  const population = country.population?.toLocaleString() || "No data";
  const flagPng = country.flags?.png; 

  // returns jsx to display the card
  return (
    <div className="country-card">
      {/* Only render the image if flagPng is true - otherwise render a placeholder or nothing */}
      {flagPng ? (
        <img src={flagPng} alt={`Flag of ${name}`} />
      ) : (
        // I use a placeholder
        <div style={{
          width: 200,
          height: 120,
          background: "#eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <span>No flag available</span>
        </div>
      )}
      <h2>{name}</h2>
      <p><strong>Capital:</strong> {capital}</p>
      <p><strong>Region:</strong> {region}</p>
      <p><strong>Population:</strong> {population}</p>
    </div>
  );
}

export default CountryCard;
