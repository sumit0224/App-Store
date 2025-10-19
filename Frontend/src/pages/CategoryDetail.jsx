import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Grid, List, Star, Download, TrendingUp, Filter } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import apiService from '../services/api';
import Navigation from '../components/Navigation';

const CategoryDetail = () => {
  const { categorySlug } = useParams();
  const { isDarkMode } = useTheme();
  const [category, setCategory] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [filterBy, setFilterBy] = useState('all');

  const categories = {
    productivity: {
      name: 'Productivity',
      description: 'Boost your efficiency with powerful productivity tools',
      icon: '📊',
      color: 'blue'
    },
    games: {
      name: 'Games',
      description: 'Entertaining games for all ages and preferences',
      icon: '🎮',
      color: 'purple'
    },
    tools: {
      name: 'Tools',
      description: 'Essential utility tools and applications',
      icon: '🛠️',
      color: 'green'
    },
    education: {
      name: 'Education',
      description: 'Learning and educational content for all ages',
      icon: '📚',
      color: 'orange'
    },
    entertainment: {
      name: 'Entertainment',
      description: 'Fun and entertainment apps for leisure time',
      icon: '🎭',
      color: 'pink'
    },
    business: {
      name: 'Business',
      description: 'Professional business applications and tools',
      icon: '💼',
      color: 'indigo'
    },
    health: {
      name: 'Health & Fitness',
      description: 'Health tracking and fitness applications',
      icon: '🏃‍♂️',
      color: 'red'
    },
    lifestyle: {
      name: 'Lifestyle',
      description: 'Daily lifestyle and personal applications',
      icon: '🌟',
      color: 'yellow'
    }
  };

  useEffect(() => {
    loadCategoryData();
  }, [categorySlug]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      
      // Set category info
      const categoryInfo = categories[categorySlug];
      if (categoryInfo) {
        setCategory(categoryInfo);
      }

      // Load apps for this category
      const response = await apiService.getApps({ 
        category: categorySlug,
        limit: 50 
      });
      setApps(response.apps || []);
    } catch (error) {
      console.error('Failed to load category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortApps = (appsList) => {
    switch (sortBy) {
      case 'name':
        return [...appsList].sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return [...appsList].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'downloads':
        return [...appsList].sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
      case 'latest':
        return [...appsList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'popular':
      default:
        return appsList;
    }
  };

  const filteredApps = () => {
    let filtered = apps;
    
    // Apply filters if needed
    // This is where you'd implement filtering logic
    
    return sortApps(filtered);
  };

  if (!category) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className={`text-3xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Category not found
          </h1>
          <Link
            to="/categories"
            className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
              isDarkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Browse All Categories
          </Link>
        </div>
      </div>
    );
  }

  const sortedApps = filteredApps();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/categories"
          className={`inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-colors duration-200 ${
            isDarkMode
              ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Categories</span>
        </Link>

        {/* Category Header */}
        <div className={`p-8 rounded-2xl mb-8 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
            : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
            <div className="text-6xl">{category.icon}</div>
            <div className="flex-1">
              <h1 className={`text-4xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {category.name}
              </h1>
              <p className={`text-lg mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {category.description}
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {sortedApps.length} apps available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div>
            <h2 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Apps in {category.name}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500'
                  : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
              } focus:outline-none`}
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="downloads">Most Downloaded</option>
              <option value="latest">Latest</option>
              <option value="name">Name A-Z</option>
            </select>
            
            {/* View Mode */}
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

        {/* Apps Grid/List */}
        {loading ? (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`animate-pulse rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
              } ${viewMode === 'grid' ? 'h-48' : 'h-24'}`}></div>
            ))}
          </div>
        ) : sortedApps.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">{category.icon}</div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              No apps found in {category.name}
            </h3>
            <p className={`mb-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Check back later for new apps in this category
            </p>
            <Link
              to="/categories"
              className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Browse Other Categories
            </Link>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {sortedApps.map((app) => (
              <Link
                key={app._id}
                to={`/app/${app.slug}`}
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
                    <div className={`w-full h-32 rounded-lg mb-3 flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        {app.title?.charAt(0) || 'A'}
                      </div>
                    </div>
                    <h3 className={`font-semibold mb-1 truncate ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {app.title}
                    </h3>
                    <p className={`text-sm truncate mb-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {app.shortDescription || 'App description'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {app.rating || '4.5'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {app.downloadCount || '1.2k'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center p-4 space-x-4">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {app.title?.charAt(0) || 'A'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold mb-1 truncate ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {app.title}
                      </h3>
                      <p className={`text-sm truncate mb-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {app.shortDescription || 'App description'}
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                          <span className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {app.rating || '4.5'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {app.downloadCount || '1.2k'} downloads
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
