import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, Search, Heart, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const MobileBottomNav = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/store', label: 'Home', icon: Home },
    { path: '/categories', label: 'Categories', icon: Grid3X3 },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/favorites', label: 'Favorites', icon: Heart },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path) => {
    if (path === '/store') {
      return location.pathname === '/store' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-30 border-t ${
      isDarkMode 
        ? 'bg-gray-900/95 backdrop-blur-sm border-gray-800' 
        : 'bg-white/95 backdrop-blur-sm border-gray-200'
    }`}>
      <div className="flex justify-around px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-1 min-w-0 flex-1 transition-colors duration-200 ${
                active
                  ? isDarkMode 
                    ? 'text-blue-400' 
                    : 'text-blue-600'
                  : isDarkMode 
                    ? 'text-gray-400 hover:text-gray-300' 
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className={`p-2 rounded-lg transition-all duration-200 ${
                active 
                  ? isDarkMode 
                    ? 'bg-blue-600/20' 
                    : 'bg-blue-100'
                  : ''
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs mt-1 truncate ${
                active 
                  ? 'font-medium' 
                  : ''
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
