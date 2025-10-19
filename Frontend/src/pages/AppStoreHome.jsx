import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, TrendingUp, ArrowRight } from 'lucide-react';
import apiService from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import Navigation from '../components/Navigation';
import BannerScroller from '../components/BannerScroller';

export default function AppStoreHome() {
  const { isDarkMode } = useTheme();
  const [featuredApps, setFeaturedApps] = useState([]);
  const [trendingApps, setTrendingApps] = useState([]);
  const [allApps, setAllApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('productivity');
  const [categories] = useState(['All', 'Productivity', 'Games', 'Tools', 'Education', 'Entertainment']);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      setLoading(true);
      
      // Load featured apps (most popular)
      const featuredResponse = await apiService.getApps({ 
        sort: 'popular', 
        limit: 6 
      });
      setFeaturedApps(featuredResponse.apps || []);

      // Load trending apps (latest)
      const trendingResponse = await apiService.getApps({ 
        sort: 'latest', 
        limit: 8 
      });
      setTrendingApps(trendingResponse.apps || []);

      // Load all apps for category filtering
      const allResponse = await apiService.getApps({ 
        limit: 20 
      });
      setAllApps(allResponse.apps || []);
    } catch (error) {
      console.error('Failed to load apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadApps();
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.searchApps(searchQuery);
      setAllApps(response.apps || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category.toLowerCase());
    // For now, we'll reload all apps and filter on the frontend
    // In a real app, you'd want to pass the category filter to the backend
    loadApps();
  };

  const filteredApps = selectedCategory === 'all' 
    ? allApps 
    : allApps.filter(app => 
        app.categories && app.categories.some(cat => 
          typeof cat === 'object' ? cat.slug === selectedCategory : false
        )
      );

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Navigation />
      <BannerScroller />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Discover Amazing Apps
          </h1>
          <p className={`text-lg md:text-xl mb-8 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Find the perfect apps for your needs
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for apps, categories, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className={`w-full px-4 py-4 pl-12 pr-16 rounded-xl border transition-colors duration-200 text-lg ${
                  isDarkMode 
                    ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-700 focus:border-blue-500' 
                    : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:border-blue-500'
                } focus:outline-none shadow-lg`}
              />
              <Search className={`absolute left-4 top-4 h-6 w-6 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <button
                onClick={() => handleSearch()}
                className={`absolute right-2 top-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Search
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${category.toLowerCase()}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.toLowerCase()
                    ? 'bg-blue-600 text-white'
                    : isDarkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Apps Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Star className={`w-6 h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Featured Apps
              </h2>
            </div>
            <Link
              to="/categories"
              className={`flex items-center space-x-1 text-sm font-medium ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'
              }`}
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className={`animate-pulse rounded-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                } h-64`}></div>
              ))
            ) : featuredApps.length === 0 ? (
              <div className={`col-span-full text-center py-16 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Star className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No featured apps available</h3>
                <p>Check back later for featured apps</p>
              </div>
            ) : (
              featuredApps.map((app) => (
                <Link
                  key={app._id}
                  to={`/app/${app.slug}`}
                  className={`block rounded-xl transition-all duration-200 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-800 border border-gray-700 hover:border-gray-600' 
                      : 'bg-white shadow-lg border border-gray-200 hover:border-gray-300 hover:shadow-xl'
                  }`}
                >
                  <div className="p-6">
                    <div className={`w-full h-32 rounded-lg mb-4 flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        {app.title?.charAt(0) || 'A'}
                      </div>
                    </div>
                    <h3 className={`font-semibold mb-2 truncate ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {app.title}
                    </h3>
                    <p className={`text-sm mb-3 line-clamp-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {app.shortDescription || 'Boost your productivity'}
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
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode ? 'bg-blue-600 text-blue-100' : 'bg-blue-100 text-blue-800'
                      }`}>
                        Featured
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Trending Apps Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Trending Apps
              </h2>
            </div>
            <Link
              to="/search"
              className={`flex items-center space-x-1 text-sm font-medium ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'
              }`}
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className={`animate-pulse rounded-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                } h-48`}></div>
              ))
            ) : trendingApps.length === 0 ? (
              <div className={`col-span-full text-center py-16 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No trending apps available</h3>
                <p>Check back later for trending apps</p>
              </div>
            ) : (
              trendingApps.map((app) => (
                <Link
                  key={app._id}
                  to={`/app/${app.slug}`}
                  className={`block rounded-lg transition-all duration-200 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-800 border border-gray-700 hover:border-gray-600' 
                      : 'bg-white shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="p-4">
                    <div className={`w-full h-24 rounded-lg mb-3 flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {app.title?.charAt(0) || 'A'}
                      </div>
                    </div>
                    <h3 className={`font-medium mb-1 truncate ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {app.title}
                    </h3>
                    <p className={`text-xs mb-2 line-clamp-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {app.shortDescription || 'Advanced coding environment'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className={`w-3 h-3 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {app.rating || '4.5'}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode ? 'bg-green-600 text-green-100' : 'bg-green-100 text-green-800'
                      }`}>
                        Trending
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
