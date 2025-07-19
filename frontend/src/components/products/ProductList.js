import React, { useState, useMemo } from 'react';
import { DataTable } from '../common/DataTable';
import { FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import Fuse from 'fuse.js';

export const ProductList = ({ products, onEdit, onDelete, onView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState('name'); // 'name' or 'description'

  const fuse = useMemo(() => new Fuse(products, {
    keys: [
      searchMode === 'name' ? 'name' : 'description',
    ],
    threshold: 0.3,
    ignoreLocation: true,
  }), [products, searchMode]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return products;
    const results = fuse.search(searchTerm);
    return results.map(r => r.item);
  }, [searchTerm, fuse, products]);

  const columns = [
    { Header: 'SKU', accessor: 'sku' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Category', accessor: 'category' },
    { Header: 'Stock', accessor: 'stockQuantity' },
    { Header: 'Price (PKR)', accessor: 'sellingPrice' },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button onClick={() => onView(row.original)}><FaEye className="text-blue-500"/></button>
          <button onClick={() => onEdit(row.original)}><FaEdit className="text-green-500"/></button>
          <button onClick={() => onDelete(row.original.id)}><FaTrash className="text-red-500"/></button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <span className="text-gray-500"><FaSearch /></span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={`Search products by ${searchMode}...`}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-gray-600 font-medium">Search by:</span>
          <button
            className={`px-3 py-1 rounded ${searchMode === 'name' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setSearchMode('name')}
          >
            Name
          </button>
          <button
            className={`px-3 py-1 rounded ${searchMode === 'description' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setSearchMode('description')}
          >
            Description
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
};