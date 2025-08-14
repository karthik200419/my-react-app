import React from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar">
      <FaSearch className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
    </div>
  );
}
