import React from 'react';
import { useAuth } from '../hooks/';
const Main: React.FC = () => {
  const auth = useAuth();
  return (
    <div>
      {auth.currentUser.username && <h1>Welcome {auth.currentUser.username}</h1>}
      <div>haihih</div>
    </div>
  );
};
export default Main;
