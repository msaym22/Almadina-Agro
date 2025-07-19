import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getProducts } from '../../api/products';
import { getCustomers } from '../../api/customers';
import { getSales } from '../../api/sales';
import { setProducts } from '../../features/products/productSlice';
import { setCustomers } from '../../features/customers/customerSlice';
import { setSales } from '../../features/sales/saleSlice';

const statCards = [
  {
    label: 'Total Products',
    key: 'totalProducts',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    label: 'Total Customers',
    key: 'totalCustomers',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H2v-2a3 3 0 0 1 5.356-1.857m7.5 1.857A2.75 2.75 0 0 0 13.5 16H8a2.75 2.75 0 0 0-2.75 2.75V20m9.5-11.25h.008v.008h-.008V8.75zm.75 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z" />
      </svg>
    ),
  },
  {
    label: 'Total Orders',
    key: 'totalOrders',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
    ),
  },
  {
    label: 'Total Revenue',
    key: 'totalRevenue',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 18V6" />
      </svg>
    ),
    isCurrency: true,
  },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const productsRes = await getProducts();
        const customersRes = await getCustomers();
        const salesRes = await getSales();
        dispatch(setProducts(productsRes.data));
        dispatch(setCustomers(customersRes.data));
        dispatch(setSales(salesRes.data));
        const totalRevenue = salesRes.data.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
        setStats({
          totalProducts: productsRes.data.length,
          totalCustomers: customersRes.data.length,
          totalOrders: salesRes.data.length,
          totalRevenue,
        });
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-5xl font-extrabold text-[#222] tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          {/* Add top right icons if needed */}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {statCards.map(card => (
          <div key={card.key} className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-between min-w-[300px]">
            <div>
              <div className="text-gray-500 text-lg mb-2">{card.label}</div>
              <div className="text-5xl font-extrabold text-[#222]">
                {card.isCurrency
                  ? `PKR ${stats[card.key].toLocaleString('en-PK')}`
                  : stats[card.key].toLocaleString('en-PK')}
              </div>
            </div>
            <div>{card.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;