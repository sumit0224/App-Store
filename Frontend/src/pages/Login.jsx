import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import apiService from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      setIsLoading(true);
      try {
        const response = await apiService.login(email, password);
        console.log('Login successful:', response);
        alert('Login successful! Welcome back!');
        // Navigate to dashboard or home page
        navigate('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
        alert(`Login failed: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked');
    alert('Google OAuth would be implemented here!');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    alert('Password reset flow would be implemented here!');
  };

  const handleCreateAccount = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="relative">
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-50 bg-[length:200%_200%] animate-gradient"></div>

        
        {/* Main card */}
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
          
          

          {/* Welcome text */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome Back!
            </h2>
            <p className="text-gray-600">
              Sign in to app-store today & start growing your business
            </p>
          </div>

          {/* Google sign in button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg py-3 px-4 flex items-center justify-center gap-3 transition-colors mb-6"
          >
            <FcGoogle/>
            <span className="font-medium text-gray-700">Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-sm text-gray-500">or sign in with email</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Email field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 8 character)"
              className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Sign in button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Decorative line */}
          <div className="flex justify-center my-6">
            <div className="w-48 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Create account */}
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={handleCreateAccount}
              className="font-semibold text-gray-900 hover:underline"
            >
              Create Free Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}