"use client"
import { deleteUserCookies, getUserCookies } from '@/lib/cookies';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id?:number;
  name?: string;
  email?: string;
  password?: string;
  img?: string;
}

interface UserContextProps {
  user: User | null;
  loading: boolean;  
  login: (userData: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);  

  const route = useRouter()
  
  useEffect(() => {
    const fetchData = async () => {
      const userdatacookie = await getUserCookies();
      if (userdatacookie) {
        login(userdatacookie);
      }
      setLoading(false);  
    };
    fetchData();
  }, []); 

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    deleteUserCookies();
    setUser(null);
    route.push("/")
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
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