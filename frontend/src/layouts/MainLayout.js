import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

const MainLayout = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header user={user} />

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>

        <footer className="bg-white py-3 px-6 border-t">
          <p className="text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Almadina Agro Vehari. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;