import React from 'react';
import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '../components';

const HomeLayout: React.FC = () => {
  return (
    <main>
      <Navbar></Navbar>
      <Outlet />
    </main>
  );
};
export default HomeLayout;
