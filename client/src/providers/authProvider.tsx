import React, { useEffect, useState } from 'react';
import { CiCircleCheck, CiLogin } from 'react-icons/ci';
import { toast } from 'react-toastify';
import AuthContext, { AuthContextType } from '../contexts/authContext';
import customFetch from '../utils/customFetch';
interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }: AuthContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState<AuthContextType['currentUser']>({
    username: '',
    email: '',
    status: 'loading',
  });

  const logout = async () => {
    try {
      const logOutRequest = await customFetch.get('/auth/logout', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (logOutRequest.status === 200) {
        toast.success('Logged out successfully!', { position: 'top-right', icon: <CiCircleCheck /> });
        setCurrentUser({ username: '', email: '', status: 'unauthenticated' });
      }
    } catch (error) {
      toast.error('Error during logging out, please try later!', { position: 'top-right', icon: <CiLogin /> });
    }
  };
  const setUser = async () => {
    const getUser = await customFetch.get('/user/current-user');
    console.dir(getUser.data);

    setCurrentUser({ username: getUser.data.user.name, email: getUser.data.user.email, status: 'authenticated' });
  };

  useEffect(() => {
    try {
      setUser();
    } catch (error) {
      setCurrentUser({ username: '', email: '', status: 'unauthenticated' });
      console.log(error);
    }
  }, []);
  return <AuthContext.Provider value={{ currentUser, logout, setUser }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
