import CountryCard from "./CountryCard";
// I'm declaring a component called CountryCardList that takes a prop called data which is an array of country objects
function CountryCardList({ data }) {
  // I start the JSX that will show
  return (
    // div for styling
    <div className="card-list">
      {/* // I loop thru each country in the data array */}
      {data.map((country) => (
        // for each country it renders a Countrycard component. The key helps React keep track of each card using a 3 letter country code if there is one available, if not it uses country.name
        <CountryCard key={country.cca3 || country.name} country={country} />
      ))}
    </div>
  );
}
// exports so it can be used elsewhere
export default CountryCardList;