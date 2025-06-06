import React from 'react';
import '../App.css';

// Defines a component that accepts a country object as a prop
function CountryCard({ country }) {
  // optional chaining (accesses values without causing errors if its not there and the OR (||) operator tells it to use the right side as a default
  const name = country.name?.common || "No name";
  const capital = country.capital?.[0] || "No capital";
  const region = country.region || "No region";
  const population = country.population?.toLocaleString() || "No data";
  const flagPng = country.flags?.png; 

  // shows how the UI should look
  return (
    <div className="country-card">
      {/* Only render the image if flagPng is truthy, otherwise render a placeholder or nothing */}
      {flagPng ? (
        <img src={flagPng} alt={`Flag of ${name}`} />
      ) : (
        // You can use a placeholder, icon, or just leave this blank
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
