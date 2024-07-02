import { Box } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { RoomProvider, UserProvider } from '../providers';

const HomeLayout: React.FC = () => {
  return (
        <UserProvider>
            <RoomProvider>  

                <Box as={'section'} width="100%" height="90vh">
                    <Outlet />
                </Box>

            </RoomProvider>
        </UserProvider>
  );
};
export default HomeLayout;
