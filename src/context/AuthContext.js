"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const AuthContext = createContext({});

// Token management utilities for cross-domain authentication
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
      document.cookie = 'outmail_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }
};

const captureTokenFromURL = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setAuthToken(token);
      document.cookie = `outmail_auth=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
      window.history.replaceState({}, document.title, window.location.pathname);
      return token;
    }
  }
  return null;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // kept only for compatibility with backend payload

  // Check authentication status
  const checkAuth = async () => {
    try {
      setLoading(true);
      
      // Check for token in URL first (OAuth redirect)
      captureTokenFromURL();
      
      // Get stored token
      const token = getAuthToken();
      
      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await api.get('/api/user/me', {
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const userData = response.data;
      const finalUser = userData.user || userData;
      setUser(finalUser);
      setUserRole(finalUser.role || null);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post('/api/auth/logout', {});
    } catch (error) {
      console.error('🚨 Logout error:', error);
    } finally {
      setAuthToken(null); // Clear stored token
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
      // Redirect to home page
      window.location.href = '/';
    }
  };

  // Login function (to be called after successful OAuth)
  const login = async () => {
    await checkAuth();
  };

  // Silently re-fetch the current user (e.g. after a payment to pick up the new plan)
  const refreshUser = async () => {
    try {
      const response = await api.get('/api/user/me');
      const userData = response.data;
      const finalUser = userData.user || userData;
      setUser(finalUser);
    } catch (_) {}
  };

  // Update user profile function
  const updateUser = async (userData) => {
    try {
      const response = await api.put('/api/user', userData);
      const updatedUser = response.data.user || response.data;
      setUser(updatedUser);
      toast.success("User updated successfully!")
      return { success: true, user: updatedUser };
    } catch (error) {      
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, error: errorMessage };
    }
  };

  // Check auth on mount and when focus returns to window
  useEffect(() => {
    checkAuth();

    // Re-check auth when user returns to the tab
    const handleFocus = () => {
      if (!loading) {
        checkAuth();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    userRole,
    login,
    logout,
    checkAuth,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};