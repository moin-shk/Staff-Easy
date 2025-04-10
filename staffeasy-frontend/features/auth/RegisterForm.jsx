import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import { useAuth } from '../../hooks/useAuth';
import React from 'react';

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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
    
    // Validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Since this is a mock implementation without a real backend registration,
      // we'll just log the registration info and then log the user in
      console.log('Registration data:', {
        name: form.name,
        email: form.email,
        password: form.password
      });
      
      // In a real application, you would call a registration API here
      // For now, we'll just use the mock login function
      const username = form.email.split('@')[0];
      
      // Simulate a successful registration by logging in
      const success = await login(username, form.password);
      
      if (success) {
        // Redirect to dashboard on successful login
        navigate('/dashboard');
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Create an Account</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-500 border border-red-200 rounded text-sm">
          {error}
        </div>
      )}

      <InputField
        label="Name"
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />
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
      <InputField
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Creating Account...' : 'Register'}
      </button>
    </form>
  );
}