import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/customers', label: 'Customers' },
  { to: '/sales', label: 'Orders' },
  { to: '/backup', label: 'Backup & Restore' },
];

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2C3E50] text-white flex flex-col p-6 shadow-lg rounded-r-xl md:rounded-none transition-all duration-300 ease-in-out">
        {/* Sidebar Header: Logo/Branding */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-1">Almadina Agro</h1>
          <p className="text-sm text-gray-300">Vehari, Pakistan</p>
        </div>
        {/* Navigation Menu */}
        <nav className="flex-grow space-y-3">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out font-semibold text-base relative
                ${location.pathname === link.to ? 'bg-[#3498DB] text-white active' : 'hover:bg-[#3498DB] hover:text-white text-gray-200'}`}
            >
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        {/* Sign Out Button */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out shadow-md"
          >
            Sign out
          </button>
        </div>
      </aside>
      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-10 lg:p-12">
        {/* Main Content Header */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <h2 className="text-4xl font-extrabold text-[#333]">{navLinks.find(l => l.to === location.pathname)?.label || 'Dashboard'}</h2>
          <div className="flex items-center space-x-6">
            {/* Search, notifications, user profile can be added here if needed */}
          </div>
        </header>
        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;