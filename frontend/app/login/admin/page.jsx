'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        username: data.username,
        role: data.role
      }));

      // Redirect to dashboard or home
      router.push('/');
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main Container - Split Screen Layout
    <div className="flex min-h-screen w-full font-sans">
      
      {/* Left Side - Dark Brown Banner */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center bg-[#5c4738] text-[#f8e8d0]">
        <div className="flex flex-col items-center space-y-4">
          <Coffee size={64} strokeWidth={1.5} />
          <h1 className="text-4xl font-bold tracking-wide">Welcome Back</h1>
          <p className="text-lg text-[#d4c5b5]">Manage your cafe with ease</p>
        </div>
      </div>

      {/* Right Side - Login Form Container */}
      <div className="flex-1 flex justify-center items-center bg-[#f8e8d0]">
        {/* Login Card */}
        <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md mx-4 border border-[#e0d6cc]">
          
          {/* Card Header */}
          <div className="flex flex-col items-center text-center mb-8 space-y-2">
            <Coffee size={40} color="#5c4738" strokeWidth={1.5} />
            <h2 className="text-2xl font-bold text-[#5c4738]">Cafe Admin Portal</h2>
            <p className="text-sm text-gray-500">Secure staff access only</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Input Field */}
            <div className="space-y-2">
              <label 
                htmlFor="username" 
                className="text-sm font-medium text-[#5c4738]"
              >
                Username
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  size={20} 
                />
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#f8e8d0] border border-[#d4c5b5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c4738] focus:border-transparent text-[#5c4738] placeholder-gray-500 transition-all"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="text-sm font-medium text-[#5c4738]"
              >
                Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  size={20} 
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#f8e8d0] border border-[#d4c5b5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c4738] focus:border-transparent text-[#5c4738] placeholder-gray-500 transition-all"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#5c4738] hover:bg-[#4a3728] text-white font-bold rounded-lg transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Secure Login'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}