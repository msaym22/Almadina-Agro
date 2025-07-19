import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-2xl text-gray-600 mt-4">Page not found</p>
        <p className="mt-2 text-gray-500">The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;