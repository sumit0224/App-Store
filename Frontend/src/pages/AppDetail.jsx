import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Download, ArrowLeft, Share2, ThumbsUp, ThumbsDown, Home, Grid3X3, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import apiService from '../services/api';

export default function AppDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadApp();
  }, [slug]);

  const loadApp = async () => {
    try {
      setLoading(true);
      const response = await apiService.getApp(slug);
      setApp(response);
      
      // Sample reviews data matching the design
      setReviews([
        {
          _id: '1',
          user: { name: 'Ethan Carter', avatar: 'EC' },
          rating: 5,
          title: 'Nova Notes is a game-changer!',
          body: 'The interface is clean and easy to use, and the features are exactly what I need to stay organized. Highly recommend!',
          createdAt: '2023-08-15',
          helpful: { up: 15, down: 2 }
        },
        {
          _id: '2',
          user: { name: 'Olivia Bennett', avatar: 'OB' },
          rating: 4,
          title: 'Great app with minor suggestions',
          body: 'I\'ve been using Nova Notes for a few weeks now, and it\'s been great. It\'s simple yet powerful, and the design is very appealing. One minor suggestion would be to add more customization options.',
          createdAt: '2023-07-22',
          helpful: { up: 8, down: 1 }
        }
      ]);
    } catch (error) {
      console.error('Failed to load app:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!isAuthenticated) {
      alert('Please login to download apps');
      navigate('/login');
      return;
    }

    try {
      setDownloading(true);
      const response = await apiService.downloadApp(app._id);
      alert('Download started! Check your downloads folder.');
      console.log('Download response:', response);
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download failed: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const renderStars = (rating, size = 'sm') => {
    const starSize = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-400'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingBars = () => {
    const ratingData = [
      { stars: 5, percentage: 50 },
      { stars: 4, percentage: 30 },
      { stars: 3, percentage: 10 },
      { stars: 2, percentage: 5 },
      { stars: 1, percentage: 5 }
    ];

    return (
      <div className="space-y-2">
        {ratingData.map(({ stars, percentage }) => (
          <div key={stars} className="flex items-center space-x-2">
            <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
              {stars}
            </span>
            <Star className="h-3 w-3 text-gray-400" />
            <div className={`flex-1 h-2 rounded-full ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {percentage}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-32 w-32 border-b-2 mx-auto ${
            isDarkMode ? 'border-white' : 'border-gray-900'
          }`}></div>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading app details...
          </p>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className={`text-6xl mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-300'}`}>📱</div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            App Not Found
          </h2>
          <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            The app you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/store')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to App Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className={`px-4 py-4 border-b ${
        isDarkMode 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className={`mr-4 p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-800 text-white' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className={`text-lg font-semibold flex-1 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            App Details
          </h1>
          <ThemeToggle />
        </div>
      </div>

      <div className="px-4 py-6">
        {/* App Summary Section */}
        <div className="flex items-start space-x-4 mb-6">
          {/* App Icon */}
          <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className={`text-2xl font-bold mb-1 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {app.title}
            </h2>
            <p className={`text-sm mb-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {app.categories?.[0]?.name || 'Productivity'}
            </p>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                {downloading ? 'Downloading...' : 'Get'}
              </button>
              <button className={`p-3 rounded-full transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}>
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Screenshots Section */}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Screenshots
          </h3>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            <div className="flex-shrink-0 w-64 h-40 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-32 h-24 bg-gray-100 rounded mb-2"></div>
                <p className="text-xs">App Screenshot</p>
              </div>
            </div>
            <div className="flex-shrink-0 w-64 h-40 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-32 h-24 bg-gray-100 rounded mb-2"></div>
                <p className="text-xs">App Screenshot</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Description
          </h3>
          <p className={`leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {app.description || 'A sleek and intuitive note-taking app with a clean interface and powerful features, designed to help you stay productive and focused.'}
          </p>
        </div>

        {/* Ratings & Reviews Section */}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Ratings & Reviews
          </h3>
          
          <div className="flex items-start space-x-6 mb-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {app.averageRating?.toFixed(1) || '4.6'}
              </div>
              {renderStars(Math.floor(app.averageRating || 4.6), 'lg')}
              <p className={`text-sm mt-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {app.reviewsCount || 1234} reviews
              </p>
            </div>
            
            <div className="flex-1">
              {renderRatingBars()}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {review.user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {review.user.name}
                        </h4>
                        <p className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {review.createdAt}
                        </p>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className={`text-sm mb-3 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {review.body}
                    </p>
                    <div className="flex items-center space-x-4">
                      <button className={`flex items-center space-x-1 text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <ThumbsUp className="h-3 w-3" />
                        <span>{review.helpful.up}</span>
                      </button>
                      <button className={`flex items-center space-x-1 text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <ThumbsDown className="h-3 w-3" />
                        <span>{review.helpful.down}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 px-4 py-2 border-t ${
        isDarkMode 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex justify-around">
          <Link to="/store" className={`flex flex-col items-center py-2 ${
            isDarkMode ? 'text-blue-500' : 'text-blue-600'
          }`}>
            <Home className="h-6 w-6 mb-1" />
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/categories" className={`flex flex-col items-center py-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Grid3X3 className="h-6 w-6 mb-1" />
            <span className="text-xs">Categories</span>
          </Link>
          <Link to="/search" className={`flex flex-col items-center py-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Download className="h-6 w-6 mb-1" />
            <span className="text-xs">Downloads</span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center py-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <User className="h-6 w-6 mb-1" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
