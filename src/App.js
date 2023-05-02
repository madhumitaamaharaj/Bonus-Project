import React, { useState, useEffect } from 'react';
import './style.css';
import { FaSearch } from 'react-icons/fa';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    const searchNpm = async () => {
      const response = await fetch(`https://api.npms.io/v2/search?q=${searchTerm}&size=12`);
      const data = await response.json();
      setSearchResults(data.results);
    };

    if (searchTerm.length > 0) {
      searchNpm();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleAddToFavorites = (packageName, description) => {
    const newFavorite = { name: packageName, description: description };
    setFavorites([...favorites, newFavorite]);
    localStorage.setItem('favorites', JSON.stringify([...favorites, newFavorite]));
  };

  return (
    <div className="App">
      <h1>NPM Package Search</h1>
      <input
        type="text"
        id="search"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
       <button className="searchButton"><FaSearch/></button>
      <ul className="search-results">
        {searchResults.map((result) => (
          <li key={result.package.name}>
            <div className="name">{result.package.name}</div>
            <button className="but"
              onClick={() => {
                const description = prompt('Add some Description');
                if (description) {
                  handleAddToFavorites(result.package.name, description);
                }
              }}
            >
              Add to favorites
            </button>
          </li>
        ))}
      </ul>
      <h2>Favorites</h2>
      <ul className="favorites">
        {favorites.map((favorite, index) => (
          <li key={favorite.name}>
            <div className="name">{favorite.name}</div>
            <div className="description">{favorite.description}</div>
            <button
              onClick={() => {
                const updatedFavorites = [...favorites];
                updatedFavorites.splice(index, 1);
                setFavorites(updatedFavorites);
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
              }}
            >
              Remove from favorites
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
