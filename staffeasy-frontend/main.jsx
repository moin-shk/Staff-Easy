import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./navbar.jsx";
import "./index.css";

// Import page components
import Dashboard from "./pages/dashboard.jsx";
import HomePage from "./pages/homePage.jsx";

// Auth context provider
import { AuthProvider } from "./context/AuthContext.jsx";

// App component with routing
const App = () => {
  return (
    <div className="app min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-4 pt-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <footer className="bg-white shadow-inner py-4 mt-10">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 StaffEasy. All rights reserved.</p>
          <p className="mt-1">Developed by Tech Titans - Web Dev 2 Project</p>
        </div>
      </footer>
    </div>
  );
};

// Render the application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);