import React from "react";
import { useParams } from "react-router-dom";

// I create a component called CountryDetail that receives a list of countries as a prop
function CountryDetail({ countries }) {
  // uses the useParams hook to get the name from the Url
  const { countryName } = useParams();
// if the countries list hasnt loaded yet it shows a message
  if (!countries || countries.length === 0) {
    return <div>Loading...</div>;
  }
// looks thru the countries list to find the country whose name matches the one in the URL ignoring case
  const country = countries.find(
    (c) => c.name.common.toLowerCase() === countryName.toLowerCase()
  );
// if no country is found, it will give a message
  if (!country) return <div>Country not found.</div>;

  // if found it displays the following
  return (
    <div>
      <h2>{country.name.common}</h2>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width={200} />
      <p><strong>Capital:</strong> {country.capital?.[0]}</p>
      <p><strong>Region:</strong> {country.region}</p>
      <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
      {/* Add more details as you like */}
    </div>
  );
}

// exports so it can be used elsewhere
export default CountryDetail;