import React from 'react';
import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '../components';

const HomeLayout: React.FC = () => {
  return (
    <main>
      <Navbar>
        <Outlet />
      </Navbar>
    </main>
  );
};
export default HomeLayout;
