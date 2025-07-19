import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const LowStockAlert = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="backdrop-blur-lg bg-gradient-to-br from-red-50 via-white to-yellow-100 p-6 rounded-2xl shadow-xl border border-white/30">
      <div className="flex items-center mb-4">
        <FaExclamationTriangle className="text-red-500 mr-2 animate-pulse" />
        <h3 className="font-bold text-lg text-red-700 tracking-wide">Low Stock Alert</h3>
      </div>

      <ul className="space-y-2">
        {products.slice(0, 5).map(product => (
          <li
            key={product.id}
            className="flex justify-between items-center border-b border-red-100 pb-2 last:border-0 last:pb-0 rounded-lg px-2 hover:bg-red-50/40 transition-transform hover:scale-[1.01]"
          >
            <div>
              <Link to={`/products/${product.id}`} className="text-blue-700 font-semibold hover:underline">
                {product.name}
              </Link>
              <p className="text-xs text-gray-400">{product.sku}</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full mb-1">Stock: {product.stock}</span>
              <span className="text-xs text-red-600 font-semibold">Low Stock</span>
            </div>
          </li>
        ))}
      </ul>

      {products.length > 5 && (
        <div className="mt-4 text-center">
          <Link to="/products?stock=low" className="text-sm text-red-700 font-semibold hover:underline">
            View all {products.length} low stock items
          </Link>
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;