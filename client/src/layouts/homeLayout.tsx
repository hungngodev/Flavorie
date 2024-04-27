import { Box } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '../components';

const HomeLayout: React.FC = () => {
  return (
    <main>
      <Navbar />
      <Box as="section">
        <Outlet />
      </Box>
    </main>
  );
};
export default HomeLayout;
