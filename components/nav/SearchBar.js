// AutoFillSearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ placeholder, options, onSelect }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = (e) => {
        const input = e.target.value;
        setInputValue(input);

        if (input.length > 1) {
            const filteredSuggestions = options.filter(option =>
                option.toLowerCase().includes(input.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        setSuggestions([]);
        onSelect(suggestion); // Pass the selected suggestion to the parent component
    };

    return (
        <div className="search-bar-container">
            <input
                className="search-input"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
            />
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li 
                            key={index} 
                            className="suggestion-item" 
                            onClick={() => handleSuggestionClick(suggestion)}
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