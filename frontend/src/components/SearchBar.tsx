/**
 * SearchBar component.
 * Text input for searching todos with debouncing.
 */

'use client';

import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (searchText: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchText, setSearchText] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchText);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchText, onSearch]);

  return (
    <div style={{ marginBottom: '16px' }}>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search todos by title or description..."
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '14px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
        }}
      />
    </div>
  );
}
