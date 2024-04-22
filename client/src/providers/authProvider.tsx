import React, { useEffect, useState } from 'react';
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
    await setCurrentUser({ username: '', email: '', status: 'unauthenticated' });
  };
  useEffect(() => {
    const setUser = async () => {
      const getUser = await customFetch.get('/user/current-user');
      // console.dir(getUser.data);
      setCurrentUser({ username: getUser.data.user.name, email: getUser.data.user.email, status: 'authenticated' });
    };
    try {
      setUser();
    } catch (error) {
      setCurrentUser({ username: '', email: '', status: 'unauthenticated' });
      console.log(error);
    }
  }, []);
  return <AuthContext.Provider value={{ currentUser, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
