import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { LOCAL_STORAGE_KEYS, DEMO_USER } from '../constants';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<{ success: boolean; error?: string }>; // No params needed
  logout: () => void;
  // setActiveSectionAuth is no longer needed with simplified flow
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user from localStorage
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER);
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        // Ensure the stored user is our demo user, otherwise ignore
        if (parsedUser.id === DEMO_USER.id) {
          setCurrentUser(parsedUser);
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER); // Clear if not demo user
        }
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
      }
    }
    setIsLoading(false);
  }, []);

  const persistUser = (user: User | null) => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
    }
    setCurrentUser(user);
  };

  const login = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        persistUser(DEMO_USER); 
        setIsLoading(false);
        resolve({ success: true });
      }, 500); // Short delay for demo
    });
  }, []);

  const logout = useCallback(() => {
    persistUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ 
        currentUser, 
        isAuthenticated: !!currentUser, 
        isLoading, 
        login, 
        logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
