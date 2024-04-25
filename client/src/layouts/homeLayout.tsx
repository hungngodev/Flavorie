import React from 'react';
import { Outlet } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '../components';

const HomeLayout: React.FC = () => {
  return (
    <main>
      <Navbar></Navbar>
      <Outlet />
      <ToastContainer autoClose={5000} limit={3} transition={Slide} />
    </main>
  );
};
export default HomeLayout;
