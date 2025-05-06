import React from 'react';
import CountryCard from '../components/CountryCard';
import localData from '../../localData';
import '../App.css';

function Home() {
  return (
    <div>
      <h1></h1>
      <div className="countries-list">
        {localData.map((country, index) => (
          <CountryCard key={index} country={country} />
        ))}
      </div>
    </div>
  );
}

export default Home;