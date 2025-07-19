import React, { useState, useEffect } from 'react';
import { searchCustomers } from '../../api/customers';
import { useDebounce } from '../../hooks/useDebounce';

const CustomerSearch = ({ onSelect, value = '' }) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setLoading(true);
      searchCustomers(debouncedSearchTerm)
        .then(response => {
          setResults(response.data.customers);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  const handleSelect = (customer) => {
    onSelect(customer);
    setSearchTerm(customer.name);
    setResults([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search customers..."
        className="w-full p-2 border rounded"
      />

      {loading && <div className="absolute right-3 top-3">Loading...</div>}

      {results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto">
          {results.map(customer => (
            <li
              key={customer.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(customer)}
            >
              <div className="font-medium">{customer.name}</div>
              <div className="text-sm text-gray-600">{customer.contact}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerSearch;