import { useState } from "react";

// This is a simple mock authentication hook for testing
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (username, password) => {
    // Mock login. you'd call an API
    setUser({ username, role: "admin" });
    setIsAuthenticated(true);
    return true;
  };

  return { user, isAuthenticated, logout, login };
};

export default useAuth;
