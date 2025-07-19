import React from 'react';
import {
  FaBox, FaUsers, FaShoppingCart, FaMoneyBillWave
} from 'react-icons/fa';

const statsConfig = [
  {
    label: 'Total Products',
    icon: <FaBox className="text-green-500 text-3xl animate-bounce" />,
    bg: 'from-green-200 via-green-100 to-white',
    key: 'products',
  },
  {
    label: 'Total Customers',
    icon: <FaUsers className="text-blue-500 text-3xl animate-pulse" />,
    bg: 'from-blue-200 via-blue-100 to-white',
    key: 'customers',
  },
  {
    label: 'Total Sales',
    icon: <FaShoppingCart className="text-purple-500 text-3xl animate-bounce" />,
    bg: 'from-purple-200 via-purple-100 to-white',
    key: 'sales',
  },
  {
    label: 'Total Revenue',
    icon: <FaMoneyBillWave className="text-yellow-500 text-3xl animate-pulse" />,
    bg: 'from-yellow-200 via-yellow-100 to-white',
    key: 'revenue',
    isCurrency: true,
  },
];

const QuickStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {statsConfig.map((stat, idx) => (
        <div
          key={stat.key}
          className={`backdrop-blur-lg bg-gradient-to-br ${stat.bg} p-6 rounded-2xl shadow-xl flex items-center gap-4 border border-white/30 hover:scale-105 transition-transform duration-200`}
        >
          <div className="flex-shrink-0">
            {stat.icon}
          </div>
          <div>
            <p className="text-gray-600 font-semibold mb-1">{stat.label}</p>
            <p className="text-3xl font-extrabold text-gray-900 drop-shadow">
              {stat.isCurrency
                ? `PKR ${stats?.revenue != null ? stats.revenue.toFixed(2) : '0.00'}`
                : stats?.[stat.key] ?? 0}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;