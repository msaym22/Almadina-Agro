import React, { useState, useEffect } from 'react';
import { searchProducts } from '../../api/products';
import { useDebounce } from '../../hooks/useDebounce';

const ProductSearch = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setLoading(true);
      searchProducts(debouncedSearchTerm)
        .then(response => {
          setResults(response.data.products);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  const handleSelect = (product) => {
    onSelect(product);
    setSearchTerm('');
    setResults([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="w-full p-2 border rounded"
      />

      {loading && <div className="absolute right-3 top-3">Loading...</div>}

      {results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto">
          {results.map(product => (
            <li
              key={product.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(product)}
            >
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-gray-600">PKR {product.sellingPrice.toFixed(2)} | Stock: {product.stock}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductSearch;