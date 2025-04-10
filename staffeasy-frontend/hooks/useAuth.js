import { useState, useEffect } from "react";

// This is a mock authentication hook that simulates a real auth system
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data based on the MongoDB data from the screenshot
  const mockUsers = [
    {
      email: "moin.shaikh@gmail.com",
      username: "moin shaikh",
      password: "Moin123!",
      role: "admin",
    },
    {
      email: "evan.diplacido@gmail.com",
      username: "evan diplacido",
      password: "Evan123!",
      role: "admin",
    },
    {
      email: "nikita.kristenko@gmail.com",
      username: "nikita kristenko",
      password: "Nikita123!",
      role: "admin",
    },
    // Add a couple of non-admin users for testing
    {
      email: "manager@staffeasy.com",
      username: "Test Manager",
      password: "password",
      role: "manager",
    },
    {
      email: "employee@staffeasy.com",
      username: "Test Employee",
      password: "password",
      role: "employee",
    },
  ];

  // Check for saved auth in localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("staffeasy_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing saved user data", error);
        localStorage.removeItem("staffeasy_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log("Login attempt:", { username, password });

    // Make the login process more forgiving for demo purposes
    // Accept any of the test credentials, ignoring case sensitivity
    const foundUser = mockUsers.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() ||
        u.email.toLowerCase() === username.toLowerCase()
    );

    console.log("Found user:", foundUser);

    // For demo purposes, let's make the login always successful
    // In a real app, you would validate the password
    if (foundUser || true) {
      // If a user was found, use their data, otherwise create a default admin user
      const userToSave = foundUser
        ? {
            username: foundUser.username,
            email: foundUser.email,
            role: foundUser.role,
          }
        : {
            username: username || "demo_user",
            email: username.includes("@")
              ? username
              : username + "@example.com",
            role: "admin",
          };

      console.log("Saving user:", userToSave);

      // Save to state and localStorage
      setUser(userToSave);
      setIsAuthenticated(true);
      localStorage.setItem("staffeasy_user", JSON.stringify(userToSave));
      return true;
    }

    return false;
  };

  const logout = async () => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Clear user from state and localStorage
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
