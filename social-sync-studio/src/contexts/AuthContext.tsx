import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { REGISTER_URL, LOGIN_URL } from '@/constante';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  updatePlan: (plan: 'basic' | 'standard' | 'premium') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<LoginResponse>(LOGIN_URL, {
        username: email, // Le backend attend 'username'
        password
      });

      const { user, token } = response.data;
      
      if (!user || !token) {
        throw new Error('Réponse invalide du serveur');
      }
      
      // Stocker le token et l'utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
    } catch (error) {
      // Propager l'erreur pour qu'elle soit catchée dans le composant Login
      throw error;
    }
  };

  const register = async (username: string, name: string, email: string, password: string) => {
    const response = await axios.post<RegisterResponse>(REGISTER_URL, {
      username,
      name,
      email,
      password
    });

    const { user, token } = response.data;
    
    // Stocker le token et l'utilisateur
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const updatePlan = (plan: 'basic' | 'standard' | 'premium') => {
    if (user) {
      const updatedUser = { ...user, plan };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateUser,
      updatePlan
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
