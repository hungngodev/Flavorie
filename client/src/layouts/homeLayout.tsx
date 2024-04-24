import React from 'react';
import { Outlet } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface HomeLayoutProps {
  children: React.ReactNode | React.ReactNode[];
}
const HomeLayout: React.FC<HomeLayoutProps> = ({ children }: HomeLayoutProps) => {
  return (
    <>
      <header>This is the header</header>
      <main>
        {children}
        <Outlet />
        <ToastContainer autoClose={5000} limit={3} transition={Slide} />
      </main>
      <footer>This is the footer</footer>
    </>
  );
};
export default HomeLayout;
