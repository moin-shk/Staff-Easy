import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <>
      <Navbar />
      <div className="mt-16 p-4">
        <Routes>
          <Route path="/" element={<h1 className="text-2xl font-bold">Welcome to StaffEasy</h1>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
