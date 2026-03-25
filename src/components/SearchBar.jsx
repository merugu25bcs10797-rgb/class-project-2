import React from 'react';
import { MdSearch } from 'react-icons/md';

const SearchBar = ({ value, onChange, placeholder = "Search transactions..." }) => {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
      <MdSearch style={{ 
        position: 'absolute', 
        left: '1rem', 
        top: '50%', 
        transform: 'translateY(-50%)', 
        color: 'var(--text-secondary)', 
        fontSize: '1.25rem' 
      }} />
      <input
        type="text"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ paddingLeft: '2.75rem', borderRadius: 'var(--radius-full)' }}
      />
    </div>
  );
};

export default SearchBar;
