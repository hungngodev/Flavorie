import React from 'react';

export type AuthContextType = {
  currentUser: {
    id: string, 
    username: string;
    avatar: string;
    email: string;
    status: 'loading' | 'unauthenticated' | 'authenticated';
    location: string;
  };
  logout: () => void;
  setUser: () => void;
};

const AuthContext = React.createContext<AuthContextType>({
  currentUser: { 
    id: '', username: '', avatar: '', email: '', location: 'my city', status: 'unauthenticated' },
  logout: () => {},
  setUser: () => {},
});

export default AuthContext;
