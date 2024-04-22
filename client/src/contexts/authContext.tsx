import React from 'react';

export type AuthContextType = {
  currentUser: { username: string; email: string; status: 'loading' | 'unauthenticated' | 'authenticated' };
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextType>({
  currentUser: { username: '', email: '', status: 'unauthenticated' },
  logout: () => {},
});

export default AuthContext;
