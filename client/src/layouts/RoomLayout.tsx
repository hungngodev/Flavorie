import { Box } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ChatProvider } from '../providers';

const HomeLayout: React.FC = () => {
    return (
        <ChatProvider>
            <Box as={'section'} width="100%" height="90vh">
                <Outlet />
            </Box>
        </ChatProvider>
    );
};
export default HomeLayout;
