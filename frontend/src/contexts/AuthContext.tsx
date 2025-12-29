import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../lib/api';

interface User {
  id: string;
  email: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, username: string) => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'fitness_tracker_current_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    const token = localStorage.getItem('auth_token');
    
    if (currentUser && token) {
      setUser(JSON.parse(currentUser));
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    signIn: async (email: string, password: string) => {
      try {
        const response = await authAPI.login({ email, password });
        
        // Store token and user info
        localStorage.setItem('auth_token', response.token);
        
        // Decode JWT to get user info (basic implementation)
        const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
        const userInfo = {
          id: tokenPayload.id,
          email: email,
        };
        
        setUser(userInfo);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userInfo));
        return userInfo;
      } catch (error) {
        throw new Error('Invalid credentials');
      }
    },
    signUp: async (email: string, password: string, username: string) => {
      try {
        const response = await authAPI.register({ email, password, username });
        
        // Store token and user info
        localStorage.setItem('auth_token', response.token);
        
        // Decode JWT to get user info (basic implementation)
        const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
        const userInfo = {
          id: tokenPayload.id,
          email: email,
          username: username,
        };
        
        setUser(userInfo);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userInfo));
        return userInfo;
      } catch (error) {
        throw new Error('Failed to create account');
      }
    },
    signOut: async () => {
      setUser(null);
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem('auth_token');
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}