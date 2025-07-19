import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSales } from '../../api/sales';
import { Link } from 'react-router-dom';
import SaleList from '../../components/sales/SaleList';
import SearchInput from '../../components/common/SearchInput';

const SalesListPage = () => {
  const dispatch = useDispatch();
  const { items, status, error, pagination } = useSelector(state => state.sales);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchSales({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSelectSale = (sale) => {
    // Handle sale selection if needed
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales</h1>
        <Link
          to="/sales/new"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Record New Sale
        </Link>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="w-1/3">
            <SearchInput
              placeholder="Search sales..."
              onSearch={handleSearch}
            />
          </div>
        </div>

        {status === 'loading' ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8">
            <p>No sales found</p>
            <Link
              to="/sales/new"
              className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Record Your First Sale
            </Link>
          </div>
        ) : (
          <>
            <SaleList
              sales={items}
              onSelect={handleSelectSale}
            />

            <div className="flex justify-between items-center mt-4">
              <div>
                Showing {items.length} of {pagination.totalItems} sales
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? 'bg-gray-200 cursor-not-allowed'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                <span className="px-3 py-1 bg-green-600 text-white rounded">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === pagination.totalPages
                      ? 'bg-gray-200 cursor-not-allowed'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SalesListPage;