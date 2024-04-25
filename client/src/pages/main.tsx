import Lottie from 'lottie-react';
import React from 'react';
import cooking1Animation from '../assets/animations/cooking1.json';
import cooking2Animation from '../assets/animations/cooking2.json';
import { useAuth } from '../hooks/';

const Main: React.FC = () => {
  const auth = useAuth();
  return (
    <div>
      {auth.currentUser.username && <h1>Welcome {auth.currentUser.username}</h1>}
      <div>haihih</div>
      <Lottie animationData={cooking1Animation} loop={true} style={{ height: 300 }} />
      <Lottie animationData={cooking2Animation} loop={true} style={{ height: 300 }} />
    </div>
  );
};
export default Main;
