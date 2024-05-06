import React from 'react';
import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '../components';
import { AuthProvider } from '../providers';

const HomeLayout: React.FC = () => {
  return (
    <main>
      <AuthProvider>
        <Navbar />
        <Outlet />
      </AuthProvider>
    </main>
  );
};
export default HomeLayout;
