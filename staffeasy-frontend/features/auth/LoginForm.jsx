import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import { useAuth } from '../../hooks/useAuth';
import React from 'react';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing again
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      console.log('Login form submission:', form);
      
      // For simplicity, use the full email as the username
      // This avoids issues with username extraction
      const username = form.email;
      
      // Call the login function from the auth context
      const success = await login(username, form.password);
      console.log('Login result:', success);
      
      if (success) {
        console.log('Login successful, navigating to dashboard');
        // Redirect to dashboard on successful login
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Login to StaffEasy</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-500 border border-red-200 rounded text-sm">
          {error}
        </div>
      )}
      
      <InputField
        label="Email"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <InputField
        label="Password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}