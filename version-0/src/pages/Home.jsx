import React from 'react';
import CountryCard from '../components/CountryCard';
import localData from '../../localData'; // static (easy to access) country data
import '../App.css';

function Home() {
  return (
    <div>
      <h1></h1>
      <div className="countries-list">
        {/* // This map method loops through the items in localData and renders a card for each country Index is used as a unique key for each card. */}
        {localData.map((country, index) => (
          <CountryCard key={index} country={country} />
        ))}
      </div>
    </div>
  );
}

export default Home;