import { Box } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '../components';
import { AuthProvider } from '../providers';
import NotificationProvider from '../providers/NotificationProvider';

const HomeLayout: React.FC = () => {
  return (
    <main>
      <AuthProvider>
        <NotificationProvider>
        <Navbar />
        
        <Box as={'section'} width="100%" height="90vh">
          <Outlet />
        </Box>
        </NotificationProvider>
        
      </AuthProvider>
    </main>
  );
};
export default HomeLayout;
