import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

interface SearchBarProps {
  onSearch: (filteredPlayers: string[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debounceTimeout = 300;
  let debounceTimer: NodeJS.Timeout;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);

    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      if (searchQuery.length > 0) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, debounceTimeout);
  };

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      const response = await fetch(`http://192.168.1.91:3000/players/search?q=${searchQuery}`);
      const data = await response.json();
      setSuggestions(data.suggestions); 
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSearchClick = () => {
    onSearch([query]);
    setSuggestions([]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    onSearch([suggestion]);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className="search-bar">
      <div className="input-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown} 
          placeholder="Search player..."
          className="search-input"
        />
        {query && (
          <MdClose className="clear-icon" onClick={clearSearch} />
        )}
      </div>
      <button
        onClick={handleSearchClick}
        className="search-button"
      >
        Search
      </button>
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="suggestion-item"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
