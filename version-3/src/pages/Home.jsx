import React from 'react';
import CountryCardList from '../components/CountryCardList';
import '../App.css';

// I create a component Home that recieves the prop countries which is an array of country objects
function Home({ countries }) {
  return (
    // I create a container showing the CountryCardList component passing the countries array as a prop called data
    <div>
      <CountryCardList data={countries} />
    </div>
  );
}

// exports to use eleswhere
export default Home;