// useAuth.js
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, attempt to retrieve user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("staffeasy_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // Query the "users" table to find a record that matches both email and password
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)  // plain text compare
      .single();

    if (error || !data) {
      console.error("Login failed:", error);
      return false;
    }
    // On success, store the user info locally
    setUser(data);
    setIsAuthenticated(true);
    localStorage.setItem("staffeasy_user", JSON.stringify(data));
    return true;
  };

  const logout = async () => {
    // Clear state and local storage
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("staffeasy_user");
    return true;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};

export default useAuth;
