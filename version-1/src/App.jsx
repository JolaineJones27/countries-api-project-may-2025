// I'm importing the useEffect hook that lets you run code at certain times and the useState hook lets me store and update data in my component
import React, { useEffect, useState } from 'react';
// Routes and Route let me show the different pages and Link makes a clickable link that'll  change the page without reloading it
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SavedCountries from './pages/SavedCountries';
import CountryDetail from './pages/CountryDetail';
// in case internet goes down
import localData from '../localData'; 

// this is my main App component - App
function App() {
  // I set up my state variable called countries which starts as a empty list. I will call the function setCountries later to update 
  const [countries, setCountries] = useState([]);

  // I use useEffect to run my code when the App first loads. The empty array makes it only run once
  useEffect(() => {
    // asking for the list from the API
    fetch("https://restcountries.com/v3.1/all")
    // when the data comes back, it turns it into JSON  
    .then((res) => res.json())
    // Cassie showed me how to sort the countries alphabetically  
    .then((data) => {
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        // I save the sorted list in my state variable called countries
        setCountries(data);
      })
      // if something goes wrong with the internet it prints an error message then uses local data from my file and sorts it the same way
      .catch((err) => {
        console.error("Using fallback data:", err);
        setCountries(
          [...localData].sort((a, b) => a.name.common.localeCompare(b.name.common))
        );
      });
  }, []);

  // returning the jsx which is the code that tells React what to render
  return (
    <div>
      <header className="app-header">
        {/* // clickable title to the Home page */}
        <h1>
          <Link to="/" className="header-link">
            Where in the world?
          </Link>
        </h1>
        {/* // link to the Saved Countries page */}
        <nav>
          <Link to="/SavedCountries">Saved Countries</Link>
        </nav>
      </header>

      {/* // route components define the app pages */}
      <Routes>
        <Route path="/" element={<Home countries={countries} />} />
        <Route path="/SavedCountries" element={<SavedCountries />} />
        <Route path="/country/:countryName" element={<CountryDetail countries={countries} />} />
      </Routes>
    </div>
  );
}

// export so I can use elsewhere
export default App;