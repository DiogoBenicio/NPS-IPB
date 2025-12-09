import React, { createContext, useState } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // TODO: Add useEffect to check token on mount
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     // Validate token
  //     setUser({ id: '1', email: 'admin@example.com', role: 'admin' });
  //   }
  // }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
