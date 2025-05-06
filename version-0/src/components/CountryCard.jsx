import React from 'react';
import '../App.css';

function CountryCard({ country }) {
  const name = country.name?.common || "No name";
  const capital = country.capital?.[0] || "No capital";
  const region = country.region || "No region";
  const population = country.population?.toLocaleString() || "No data";
  const flagPng = country.flags?.png || "";

  return (
    <div className="country-card">
      <img src={flagPng} alt={`Flag of ${name}`} />
      <h2>{name}</h2>
      <p><strong>Capital:</strong> {capital}</p>
      <p><strong>Region:</strong> {region}</p>
      <p><strong>Population:</strong> {population}</p>
    </div>
  );
}

export default CountryCard;

