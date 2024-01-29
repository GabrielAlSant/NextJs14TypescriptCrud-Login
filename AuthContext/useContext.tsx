"use client"
import { deleteUserCookies } from '@/lib/cookies';
import { createContext, useContext, ReactNode, useState } from 'react';

interface User {
  name?: string;
  email?: string;
  password?: string;
  img?: string;
}

interface UserContextProps {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    deleteUserCookies()
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('Algo deu errado');
  }
  return context;
};