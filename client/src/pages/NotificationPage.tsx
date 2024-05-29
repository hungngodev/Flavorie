import React from 'react';
import NotificationHeader from '../components/notifications/NotificationHeader.tsx';
import NotificationProvider from '../providers/NotificationProvider.tsx';
import { AuthProvider } from '../providers/index.ts';



const NotificationPage: React.FC = () => {
    return (
        <div>
            
            <NotificationProvider>
                <AuthProvider>
                    <NotificationHeader />
                </AuthProvider>
            </NotificationProvider>
            
        </div>
    );
};

export default NotificationPage;
