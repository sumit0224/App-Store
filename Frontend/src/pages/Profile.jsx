import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Download, 
  Star, 
  Heart, 
  Edit3, 
  Camera, 
  Mail, 
  Calendar,
  Shield,
  Code,
  Award,
  Activity,
  Bell
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';

const Profile = () => {
  const { isDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalDownloads: 24,
    totalReviews: 8,
    totalFavorites: 12,
    memberSince: '2024-01-15'
  });

  if (!user) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <User className={`w-16 h-16 mx-auto mb-6 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h1 className={`text-3xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Sign in to view profile
          </h1>
          <p className={`text-lg mb-8 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Create an account or sign in to access your profile
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                  : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const mockDownloads = [
    { id: 1, name: 'Notion', date: '2024-01-20', size: '150 MB' },
    { id: 2, name: 'VS Code', date: '2024-01-18', size: '300 MB' },
    { id: 3, name: 'Spotify', date: '2024-01-15', size: '200 MB' },
  ];

  const mockReviews = [
    { id: 1, app: 'Notion', rating: 5, comment: 'Great productivity app!', date: '2024-01-20' },
    { id: 2, app: 'VS Code', rating: 5, comment: 'Perfect for development', date: '2024-01-18' },
  ];

  const mockFavorites = [
    { id: 1, name: 'Notion', category: 'Productivity' },
    { id: 2, name: 'Spotify', category: 'Entertainment' },
    { id: 3, name: 'VS Code', category: 'Tools' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <Download className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  <div>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.totalDownloads}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Downloads
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <Star className={`w-8 h-8 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                  <div>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.totalReviews}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Reviews
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <Heart className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
                  <div>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.totalFavorites}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Favorites
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <Calendar className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                  <div>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(stats.memberSince).getMonth() + 1}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Months
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Download className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Downloaded Notion
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    2 days ago
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Reviewed VS Code
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    4 days ago
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Added Spotify to favorites
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    1 week ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'downloads':
        return (
          <div className={`p-6 rounded-lg ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Downloaded Apps
            </h3>
            <div className="space-y-3">
              {mockDownloads.map((download) => (
                <div key={download.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {download.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {download.name}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Downloaded on {new Date(download.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {download.size}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className={`p-6 rounded-lg ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Your Reviews
            </h3>
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {review.app}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating 
                              ? isDarkMode ? 'text-yellow-400' : 'text-yellow-500'
                              : isDarkMode ? 'text-gray-600' : 'text-gray-300'
                          }`}
                          fill={i < review.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {review.comment}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className={`p-6 rounded-lg ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Favorite Apps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockFavorites.map((favorite) => (
                <div key={favorite.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold mb-3">
                    {favorite.name.charAt(0)}
                  </div>
                  <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {favorite.name}
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {favorite.category}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Account Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                      isDarkMode
                        ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                        : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
                    } focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${
                      isDarkMode
                        ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                        : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
                    } focus:outline-none`}
                  />
                </div>
                <button className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}>
                  Save Changes
                </button>
              </div>
            </div>

            <div className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Danger Zone
              </h3>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-red-500 text-white hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className={`p-6 rounded-lg mb-8 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
            {/* Profile Picture */}
            <div className="relative">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
              }`}>
                <User className="w-12 h-12 text-white" />
              </div>
              <button className={`absolute bottom-0 right-0 p-2 rounded-full ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}>
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className={`text-2xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user.name}
              </h1>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center space-x-1">
                  <Mail className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {user.role === 'admin' ? (
                    <Shield className={`w-4 h-4 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
                  ) : user.role === 'developer' ? (
                    <Code className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  ) : (
                    <User className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                  )}
                  <span className={`text-sm capitalize ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to="/profile/update"
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isDarkMode
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Link>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Member since {new Date(stats.memberSince).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? isDarkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile;
