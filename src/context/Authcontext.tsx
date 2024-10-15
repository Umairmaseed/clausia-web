import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserService } from '../services/User';
import { useNavigate } from 'react-router-dom';


type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => void;
  login: (user: User) => void;
  setLoading: (state: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { data, isLoading: queryLoading, error } = useQuery({
    queryKey: ['UserInfo'],
    queryFn: () => UserService.infoUser(),
  });

  useEffect(() => {
    if (!queryLoading) {
      if (error) {
        setUser(null);
        setIsLoggedIn(false);
        navigate('/login');
      } else if (data) {
        setUser(data);
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    }
  }, [queryLoading, data, error]);

  const logout = () => {
    UserService.logoutUser();
    setUser(null);
    setIsLoggedIn(false);
    navigate('/login');
  };

  const login = (user: User) => {
    setLoading(true);
    setUser(user);
    setIsLoggedIn(true);
  };

  const setLoading = (state: boolean) => {
    setIsLoading(state);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isLoading, logout, login, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
