// LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    setIsLoading(true);
    const success = await login(form.email, form.password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
        Login to StaffEasy
      </h2>
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
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
