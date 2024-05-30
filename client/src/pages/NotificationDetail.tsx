import React from 'react';
import NotificationDetail from '../components/notifications/NotificationDetail.tsx';
import NotificationProvider from '../providers/NotificationProvider.tsx';
import { AuthProvider } from '../providers/index.ts';



const NotificationDetailPage: React.FC = () => {
    return (
        <div>
            
            <NotificationProvider>
                <AuthProvider>
                    <NotificationDetail />
                </AuthProvider>
            </NotificationProvider>
            
        </div>
    );
};

export default NotificationDetailPage;
