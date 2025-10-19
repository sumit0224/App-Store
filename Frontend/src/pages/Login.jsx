import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/dashboard';

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
        await login(email, password);
        console.log('Login successful!');
        // Navigate to the intended destination or dashboard
        navigate(from, { replace: true });
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
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="relative w-full max-w-md">
        {/* Theme toggle */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>

        {/* Glowing border effect */}
        <div className={`absolute inset-0 rounded-3xl blur-2xl opacity-50 bg-[length:200%_200%] animate-gradient ${
          isDarkMode 
            ? 'bg-gradient-to-br from-green-400 via-purple-500 to-blue-500' 
            : 'bg-gradient-to-br from-green-400 via-purple-500 to-blue-500'
        }`}></div>

        {/* Main card */}
        <div className={`relative rounded-3xl shadow-2xl w-full p-8 transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Welcome text */}
          <div className="text-center mb-8">
            <h2 className={`text-4xl font-bold mb-3 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome Back!
            </h2>
            <p className={`${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Sign in to app-store today & start growing your business
            </p>
          </div>

          {/* Google sign in button */}
          <button
            onClick={handleGoogleSignIn}
            className={`w-full rounded-lg py-3 px-4 flex items-center justify-center gap-3 transition-colors mb-6 ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' 
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FcGoogle/>
            <span className={`font-medium ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Sign in with Google
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`flex-1 border-t ${
              isDarkMode ? 'border-gray-600' : 'border-gray-200'
            }`}></div>
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              or sign in with email
            </span>
            <div className={`flex-1 border-t ${
              isDarkMode ? 'border-gray-600' : 'border-gray-200'
            }`}></div>
          </div>

          {/* Email field */}
          <div className="mb-4">
            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500' 
                    : 'border-gray-200 focus:ring-gray-900'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className={`block text-sm font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className={`text-sm transition-colors ${
                  isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                errors.password 
                  ? 'border-red-500 focus:ring-red-500' 
                  : isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500' 
                    : 'border-gray-200 focus:ring-gray-900'
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Sign in button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-900 hover:bg-gray-800 text-white'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Decorative line */}
          <div className="flex justify-center my-6">
            <div className={`w-48 h-1 rounded-full ${
              isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
            }`}></div>
          </div>

          {/* Create account */}
          <p className={`text-center ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Don't have an account?{' '}
            <button
              onClick={handleCreateAccount}
              className={`font-semibold hover:underline transition-colors ${
                isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'
              }`}
            >
              Create Free Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}