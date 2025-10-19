import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Download, Grid, List, Trash2, Search } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import Navigation from '../components/Navigation';

const Favorites = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'name', 'rating'

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // For now, we'll simulate favorites data
      // In a real app, you'd have an API endpoint for user favorites
      const mockFavorites = [
        {
          _id: '1',
          title: 'Notion',
          slug: 'notion',
          shortDescription: 'All-in-one workspace for notes, docs, and projects',
          rating: 4.8,
          downloadCount: '10M',
          icon: '📝',
          addedToFavorites: new Date('2024-01-15'),
          category: 'productivity'
        },
        {
          _id: '2',
          title: 'Spotify',
          slug: 'spotify',
          shortDescription: 'Music streaming platform',
          rating: 4.7,
          downloadCount: '500M',
          icon: '🎵',
          addedToFavorites: new Date('2024-01-10'),
          category: 'entertainment'
        },
        {
          _id: '3',
          title: 'VS Code',
          slug: 'vscode',
          shortDescription: 'Code editor for developers',
          rating: 4.9,
          downloadCount: '50M',
          icon: '💻',
          addedToFavorites: new Date('2024-01-08'),
          category: 'tools'
        }
      ];
      
      setFavorites(mockFavorites);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = (appId) => {
    setFavorites(prev => prev.filter(app => app._id !== appId));
    // In a real app, you'd call an API to remove from favorites
  };

  const filteredAndSortedFavorites = () => {
    let filtered = favorites;
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(app =>
        app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort
    switch (sortBy) {
      case 'name':
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'date':
      default:
        return [...filtered].sort((a, b) => new Date(b.addedToFavorites) - new Date(a.addedToFavorites));
    }
  };

  const sortedFavorites = filteredAndSortedFavorites();

  if (!user) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Heart className={`w-16 h-16 mx-auto mb-6 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h1 className={`text-3xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Sign in to view favorites
          </h1>
          <p className={`text-lg mb-8 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Create an account or sign in to save your favorite apps
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

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            My Favorites
          </h1>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Your saved apps and collections
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3 top-3 h-5 w-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search your favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:border-blue-500'
                  : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:border-blue-500'
              } focus:outline-none`}
            />
          </div>
          
          {/* Sort and View Controls */}
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500'
                  : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
              } focus:outline-none`}
            >
              <option value="date">Date Added</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
            </select>
            
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors duration-200 ${
                  viewMode === 'grid'
                    ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors duration-200 ${
                  viewMode === 'list'
                    ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Favorites Content */}
        {loading ? (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`animate-pulse rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
              } ${viewMode === 'grid' ? 'h-48' : 'h-24'}`}></div>
            ))}
          </div>
        ) : sortedFavorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className={`w-16 h-16 mx-auto mb-6 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {searchQuery ? 'No favorites found' : 'No favorites yet'}
            </h3>
            <p className={`mb-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Start exploring apps and add them to your favorites'
              }
            </p>
            {!searchQuery && (
              <Link
                to="/store"
                className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Browse Apps
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-8">
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {sortedFavorites.length} favorite app{sortedFavorites.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Favorites Grid/List */}
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {sortedFavorites.map((app) => (
                <div
                  key={app._id}
                  className={`block rounded-lg transition-all duration-200 hover:scale-105 ${
                    viewMode === 'grid'
                      ? isDarkMode 
                        ? 'bg-gray-800 border border-gray-700 hover:border-gray-600' 
                        : 'bg-white shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md'
                      : isDarkMode 
                        ? 'bg-gray-800 border border-gray-700 hover:border-gray-600' 
                        : 'bg-white shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          {app.icon}
                        </div>
                        <button
                          onClick={() => removeFromFavorites(app._id)}
                          className={`p-2 rounded-full transition-colors duration-200 ${
                            isDarkMode
                              ? 'text-red-400 hover:bg-gray-700 hover:text-red-300'
                              : 'text-red-500 hover:bg-gray-100 hover:text-red-600'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <Link to={`/app/${app.slug}`} className="block">
                        <h3 className={`font-semibold mb-1 truncate ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {app.title}
                        </h3>
                        <p className={`text-sm truncate mb-3 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {app.shortDescription}
                        </p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                            <span className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {app.rating}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {app.downloadCount}
                            </span>
                          </div>
                        </div>
                        
                        <p className={`text-xs ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          Added {new Date(app.addedToFavorites).toLocaleDateString()}
                        </p>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center p-4 space-x-4">
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        {app.icon}
                      </div>
                      
                      <Link to={`/app/${app.slug}`} className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`font-semibold mb-1 truncate ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {app.title}
                            </h3>
                            <p className={`text-sm truncate mb-2 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {app.shortDescription}
                            </p>
                            
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Star className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                                <span className={`text-sm ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {app.rating}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Download className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <span className={`text-sm ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {app.downloadCount}
                                </span>
                              </div>
                              <span className={`text-xs ${
                                isDarkMode ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                Added {new Date(app.addedToFavorites).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                      
                      <button
                        onClick={() => removeFromFavorites(app._id)}
                        className={`p-2 rounded-full transition-colors duration-200 ${
                          isDarkMode
                            ? 'text-red-400 hover:bg-gray-700 hover:text-red-300'
                            : 'text-red-500 hover:bg-gray-100 hover:text-red-600'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
