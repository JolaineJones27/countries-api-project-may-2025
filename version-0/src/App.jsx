import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SavedCountries from './pages/SavedCountries';
import CountryDetail from './pages/CountryDetail';

function App() {
  return (
    <div>
      <header className="app-header">
  <h1>
    <Link to="/" className="header-link">
      Where in the world?
    </Link>
  </h1>
  <nav>
        <Link to="/SavedCountries">Saved Countries</Link>
  </nav>
</header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SavedCountries" element={<SavedCountries />} />
        <Route path="/CountryDetail" element={<CountryDetail />} />
      </Routes>
    </div>
  );
}

export default App;
