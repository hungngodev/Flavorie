// import React from 'react';
// import useNotification from '../hooks/useNotification.tsx';

// const NotificationsList: React.FC = () => {
//     const { notifications } = useNotification();

//     return (
//         <div>
//             <h2>Notifications</h2>
//             <ul>
//                 {notifications.map(notification => (
//                     <li key={notification.taskId}>
//                         <h3>{notification.message.title}</h3>
//                         <div>
//                             {Object.entries(notification.message.data).map(([key, value]) => (
//                                 <p key={key}><strong>{key}:</strong> {String(value)}</p>
//                             ))}
//                         </div>
//                         <p>Status: {notification.status}</p>
//                         <p>Time: {new Date(notification.timestamp).toLocaleString()}</p>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default NotificationsList;
