import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFoundPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.2) * 20,
        y: (e.clientY / window.innerHeight - 0.2) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-10 animate-pulse"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div 
        className={`relative z-10 text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
        }}
      >
        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[200px] font-bold text-white mb-4 animate-bounce relative">
            404
            <span className="absolute -top-4 -right-4 text-6xl">🔍</span>
          </h1>
          <div className="h-2 w-64 mx-auto bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full animate-pulse" />
        </div>

        {/* Message */}
        <div className="space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-purple-200 max-w-md mx-auto">
            The page you're looking for seems to have wandered off into the digital void.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 px-8 py-4 bg-white text-purple-900 rounded-full font-semibold text-lg hover:bg-purple-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <Home className="group-hover:rotate-12 transition-transform" />
            Home Page
          </button>
        </div>

        {/* Search suggestion */}
        <div className="mt-12 flex items-center justify-center gap-2 text-purple-200">
          <Search size={20} />
          <p className="text-sm">Try searching or navigate back to safety</p>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-10 left-10 text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>
        ⭐
      </div>
      <div className="absolute top-20 right-20 text-6xl animate-bounce" style={{ animationDelay: '1s' }}>
        🌙
      </div>
      <div className="absolute bottom-20 right-32 text-6xl animate-bounce" style={{ animationDelay: '1.5s' }}>
        ✨
      </div>
    </div>
  );
}