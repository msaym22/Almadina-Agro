import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';

const SalesSummary = ({ sales }) => {
  if (!sales || sales.length === 0) return null;

  return (
    <div className="backdrop-blur-lg bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 rounded-2xl shadow-xl border border-white/30">
      <h3 className="font-bold text-lg mb-4 text-blue-700 tracking-wide">Recent Sales</h3>

      <div className="space-y-3">
        {sales.map(sale => (
          <div
            key={sale.id}
            className="border-b border-blue-100 pb-3 last:border-0 last:pb-0 transition-transform hover:scale-[1.02] hover:bg-blue-50/40 rounded-lg px-2"
          >
            <div className="flex justify-between items-center">
              <div>
                <Link
                  to={`/sales/${sale.id}`}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Sale #{sale.id}
                </Link>
                <p className="text-xs text-gray-500 mt-1">
                  {sale.customer?.name || 'Walk-in Customer'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-800">{formatCurrency(sale.totalAmount)}</p>
                <p className="text-xs capitalize text-gray-500">
                  {sale.paymentMethod} • {sale.paymentStatus}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(sale.date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <Link to="/sales" className="text-sm text-blue-700 font-semibold hover:underline">
          View all sales
        </Link>
      </div>
    </div>
  );
};

export default SalesSummary;