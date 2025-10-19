import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid3X3, ArrowRight, TrendingUp, Star, Users } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import apiService from '../services/api';
import Navigation from '../components/Navigation';

const Categories = () => {
  const { isDarkMode } = useTheme();
  const [categories, setCategories] = useState([
    {
      id: 'productivity',
      name: 'Productivity',
      description: 'Apps to boost your productivity and efficiency',
      icon: '📊',
      appCount: 24,
      featured: true
    },
    {
      id: 'games',
      name: 'Games',
      description: 'Entertaining games for all ages',
      icon: '🎮',
      appCount: 18,
      featured: true
    },
    {
      id: 'tools',
      name: 'Tools',
      description: 'Utility tools and applications',
      icon: '🛠️',
      appCount: 15,
      featured: false
    },
    {
      id: 'education',
      name: 'Education',
      description: 'Learning and educational content',
      icon: '📚',
      appCount: 12,
      featured: true
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      description: 'Fun and entertainment apps',
      icon: '🎭',
      appCount: 20,
      featured: false
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Professional business applications',
      icon: '💼',
      appCount: 8,
      featured: false
    },
    {
      id: 'health',
      name: 'Health & Fitness',
      description: 'Health tracking and fitness apps',
      icon: '🏃‍♂️',
      appCount: 10,
      featured: false
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle',
      description: 'Daily lifestyle and personal apps',
      icon: '🌟',
      appCount: 14,
      featured: false
    }
  ]);

  const [appsByCategory, setAppsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppsByCategory();
  }, []);

  const loadAppsByCategory = async () => {
    try {
      setLoading(true);
      const appsData = {};
      
      for (const category of categories) {
        try {
          const response = await apiService.getApps({ 
            category: category.id,
            limit: 4 
          });
          appsData[category.id] = response.apps || [];
        } catch (error) {
          console.error(`Failed to load apps for ${category.name}:`, error);
          appsData[category.id] = [];
        }
      }
      
      setAppsByCategory(appsData);
    } catch (error) {
      console.error('Failed to load apps by category:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredCategories = categories.filter(cat => cat.featured);
  const otherCategories = categories.filter(cat => !cat.featured);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            App Categories
          </h1>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Discover apps organized by category to find exactly what you need
          </p>
        </div>

        {/* Featured Categories */}
        <section className="mb-16">
          <div className="flex items-center space-x-2 mb-8">
            <Star className={`w-6 h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
            <h2 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Featured Categories
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <div
                key={category.id}
                className={`rounded-2xl p-6 transition-all duration-200 hover:scale-105 hover:shadow-xl ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-gray-600' 
                    : 'bg-white shadow-lg border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl">{category.icon}</div>
                  <div>
                    <h3 className={`text-xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {category.name}
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {category.appCount} apps
                    </p>
                  </div>
                </div>
                
                <p className={`text-sm mb-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {category.description}
                </p>
                
                <Link
                  to={`/category/${category.id}`}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isDarkMode
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <span>Explore Apps</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* All Categories */}
        <section className="mb-16">
          <div className="flex items-center space-x-2 mb-8">
            <Grid3X3 className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <h2 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              All Categories
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className={`block rounded-xl p-4 transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-800 border border-gray-700 hover:border-gray-600 hover:bg-gray-750' 
                    : 'bg-white shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {category.name}
                    </h3>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {category.appCount} apps
                    </p>
                  </div>
                </div>
                
                <p className={`text-xs ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Apps by Category */}
        <section>
          <div className="flex items-center space-x-2 mb-8">
            <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
            <h2 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Popular Apps by Category
            </h2>
          </div>
          
          <div className="space-y-8">
            {featuredCategories.slice(0, 3).map((category) => (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {category.icon} {category.name}
                  </h3>
                  <Link
                    to={`/category/${category.id}`}
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
                    [...Array(4)].map((_, i) => (
                      <div key={i} className={`animate-pulse rounded-lg ${
                        isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                      } h-32`}></div>
                    ))
                  ) : (appsByCategory[category.id] || []).map((app) => (
                    <Link
                      key={app._id}
                      to={`/app/${app.slug}`}
                      className={`block rounded-lg p-4 transition-all duration-200 hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-gray-800 border border-gray-700 hover:border-gray-600' 
                          : 'bg-white shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className={`w-full h-16 rounded-lg mb-3 flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {app.title?.charAt(0) || 'A'}
                        </div>
                      </div>
                      <h4 className={`font-medium text-sm mb-1 truncate ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {app.title}
                      </h4>
                      <p className={`text-xs truncate ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {app.shortDescription || 'App description'}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Categories;
