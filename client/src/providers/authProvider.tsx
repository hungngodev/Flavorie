import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { CiCircleCheck, CiLogin } from 'react-icons/ci';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext, { AuthContextType } from '../contexts/authContext';
import customFetch from '../utils/customFetch';

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }: AuthContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState<AuthContextType['currentUser']>({
    id: '',
    username: '',
    email: '',
    location: '',
    avatar: '',
    status: 'unauthenticated',
  });
  const location = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const logOutRequest = await customFetch.get('/auth/logout', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (logOutRequest.status === 200) {
        toast.success('Logged out successfully!', { position: 'top-right', icon: <CiCircleCheck /> });
        setCurrentUser({ id: '', username: '', email: '', location: '', avatar: '', status: 'unauthenticated' });
      }
      queryClient.invalidateQueries();
      navigate('/');
    } catch (error) {
      toast.error('Error during logging out, please try later!', { position: 'top-right', icon: <CiLogin /> });
    }
  };

  const setUser = async () => {
    try {
      const getUser = await customFetch.get('/auth');
      if (getUser.data.msg === 'Unauthorized') {
        setCurrentUser({ id: '', username: '', email: '', location: '', avatar: '', status: 'unauthenticated' });
        return;
      }
      setCurrentUser({
        id: getUser.data.user._id,
        username: getUser.data.user.name,
        email: getUser.data.user.email,
        location: getUser.data.user.location,
        avatar: getUser.data.user.avatar,
        status: 'authenticated',
      });
    } catch (error) {
      setCurrentUser({ id: '', username: '', email: '', location: '', avatar: '', status: 'unauthenticated' });
    }
  };

  useEffect(() => {
    const setIntervalId = setInterval(() => {
      setUser();
    }, 60000);
    return () => clearInterval(setIntervalId);
  }, []);
  useEffect(() => {
    setUser();
  }, [location]);

  return <AuthContext.Provider value={{ currentUser, logout, setUser }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
