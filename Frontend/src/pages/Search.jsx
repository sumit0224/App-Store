import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, Star, Download, TrendingUp, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import apiService from '../services/api';
import Navigation from '../components/Navigation';

const SearchPage = () => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    category: 'all',
    price: 'all',
    rating: 'all'
  });
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([
    'Productivity apps',
    'Photo editing',
    'Games',
    'Music streaming',
    'Fitness tracker',
    'Note taking',
    'Weather',
    'Social media'
  ]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await apiService.searchApps(query);
      setSearchResults(response.apps || []);
      
      // Save to recent searches
      const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const sortResults = (results) => {
    switch (sortBy) {
      case 'name':
        return [...results].sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return [...results].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'downloads':
        return [...results].sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
      case 'latest':
        return [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return results;
    }
  };

  const filteredResults = sortResults(searchResults);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Search Apps
          </h1>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Find the perfect app for your needs
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for apps, categories, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
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

        {/* Quick Search Suggestions */}
        {!searchResults.length && !loading && (
          <div className="max-w-4xl mx-auto">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Recent Searches
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className={`text-sm ${
                      isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(search)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isDarkMode
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
                      }`}
                    >
                      <Clock className="w-4 h-4 inline mr-2" />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(search)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isDarkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 inline mr-2" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <>
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <div>
                <h2 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {filteredResults.length} results for "{searchQuery}"
                </h2>
              </div>
              
              {/* Controls */}
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
                  <option value="relevance">Relevance</option>
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                  <option value="downloads">Downloads</option>
                  <option value="latest">Latest</option>
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

            {/* Results Grid/List */}
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
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filteredResults.map((app) => (
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

            {/* No Results */}
            {filteredResults.length === 0 && !loading && (
              <div className="text-center py-12">
                <Search className={`w-16 h-16 mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  No apps found
                </h3>
                <p className={`${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Try adjusting your search terms or browse our categories
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
