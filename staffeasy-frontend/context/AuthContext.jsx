import React, { createContext, useState, useEffect } from 'react';
import { useAuth as useAuthHook } from '../hooks/useAuth';

// Create the authentication context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuthHook();
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (could be done using tokens in localStorage or cookies)
  useEffect(() => {
    // This would be where you verify tokens, etc.
    // For now, we're just using the mock auth state from the hook
    setLoading(false);
  }, []);

  // Provide auth state and functions to all child components
  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        login: auth.login,
        logout: auth.logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};