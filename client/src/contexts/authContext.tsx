import React from 'react';

export type AuthContextType = {
  currentUser: { username: string; email: string; status: 'loading' | 'unauthenticated' | 'authenticated' };
  // token: string | null;
  logout: () => void;
  setUser: () => void;
};

const AuthContext = React.createContext<AuthContextType>({
  currentUser: { username: '', email: '', status: 'unauthenticated' },
  // token: null,
  logout: () => {},
  setUser: () => {},
});

export default AuthContext;
