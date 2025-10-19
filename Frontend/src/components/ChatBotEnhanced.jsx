import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, Mic, MicOff, Paperclip, Smile } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useChatBot } from '../contexts/ChatBotContext';
import apiService from '../services/api';

const ChatBotEnhanced = () => {
  const { isDarkMode } = useTheme();
  const { 
    isVisible, 
    chatHistory, 
    isTyping, 
    addMessage, 
    clearHistory, 
    toggleVisibility, 
    setTyping,
    getContextualSuggestions,
    getAppStoreContext 
  } = useChatBot();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Drag & Resize state
  const [position, setPosition] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('chatbot_position'));
      if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') return saved;
    } catch {}
    return { x: null, y: null }; // null means use bottom-right offset
  });
  const [size, setSize] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('chatbot_size'));
      if (saved && typeof saved.w === 'number' && typeof saved.h === 'number') return saved;
    } catch {}
    return { w: 384, h: 600 }; // default w-96, h-[600px]
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ w: 0, h: 0, x: 0, y: 0 });

  // Use chat history from context if available, otherwise use local state
  const messages = chatHistory.length > 0 ? chatHistory : [
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m your AI assistant for the App Store. How can I help you today?',
      timestamp: new Date()
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Persist position/size
  useEffect(() => {
    try { localStorage.setItem('chatbot_position', JSON.stringify(position)); } catch {}
  }, [position]);
  useEffect(() => {
    try { localStorage.setItem('chatbot_size', JSON.stringify(size)); } catch {}
  }, [size]);

  // Drag handlers
  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const newX = clientX - dragOffset.x;
      const newY = clientY - dragOffset.y;
      const maxX = window.innerWidth - size.w - 16; // padding from edges
      const maxY = window.innerHeight - (isMinimized ? 64 : size.h) - 16;
      const clampedX = Math.max(16, Math.min(newX, Math.max(16, maxX)));
      const clampedY = Math.max(16, Math.min(newY, Math.max(16, maxY)));
      setPosition({ x: clampedX, y: clampedY });
    };
    const stop = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', stop);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', stop);
    };
  }, [isDragging, dragOffset, size.w, size.h, isMinimized]);

  // Resize handlers
  useEffect(() => {
    const handleResizeMove = (e) => {
      if (!isResizing) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - resizeStart.x;
      const deltaY = clientY - resizeStart.y;
      const minW = 320; // w-80
      const minH = isMinimized ? 64 : 320;
      const maxW = Math.min(640, window.innerWidth - 32);
      const maxH = Math.min(900, window.innerHeight - 32);
      const nextW = Math.max(minW, Math.min(resizeStart.w + deltaX, maxW));
      const nextH = Math.max(minH, Math.min(resizeStart.h + deltaY, maxH));
      setSize({ w: nextW, h: nextH });
    };
    const stop = () => setIsResizing(false);
    window.addEventListener('mousemove', handleResizeMove);
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchmove', handleResizeMove, { passive: false });
    window.addEventListener('touchend', stop);
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchmove', handleResizeMove);
      window.removeEventListener('touchend', stop);
    };
  }, [isResizing, resizeStart, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      text: inputMessage.trim(),
      timestamp: new Date()
    };

    addMessage(userMessage);
    setInputMessage('');
    setIsLoading(true);
    setTyping(true);

    try {
      const data = await apiService.sendChatMessage(userMessage.text, 'app_store');
      
      const botMessage = {
        type: 'bot',
        text: data.response,
        timestamp: new Date()
      };

      addMessage(botMessage);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        type: 'bot',
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        timestamp: new Date()
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
      setTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const quickQuestions = getContextualSuggestions('home');

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    if (isOpen) {
      setTimeout(() => handleSendMessage(), 100);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const emojis = ['😀', '😊', '😂', '😍', '🤔', '👍', '👎', '❤️', '🎉', '🔥'];

  if (!isVisible || !isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
          }`}
          aria-label="Open ChatBot"
        >
          <MessageCircle className="w-6 h-6" />
          {isTyping && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </button>
      </div>
    );
  }

  // Compute anchored position if not yet dragged
  const dynamicStyle = () => {
    const style = { width: isMinimized ? 320 : size.w, height: isMinimized ? 64 : size.h };
    if (position.x == null || position.y == null) {
      // bottom-right by default (24px ~ bottom-6/right-6)
      style.position = 'fixed';
      style.right = 24;
      style.bottom = 24;
    } else {
      style.position = 'fixed';
      style.left = position.x;
      style.top = position.y;
    }
    return style;
  };

  return (
    <div
      ref={containerRef}
      className={`fixed z-50 transition-all duration-300 select-none`}
      style={dynamicStyle()}
    >
      <div className={`${isMinimized ? 'h-16' : 'h-full'} rounded-2xl shadow-2xl border backdrop-blur-sm ${
        isDarkMode 
          ? 'bg-gray-800/95 border-gray-700' 
          : 'bg-white/95 border-gray-200'
      }`}>
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 rounded-t-2xl cursor-move ${
          isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gradient-to-r from-gray-50 to-gray-100'
          }`}
          onMouseDown={(e) => {
            if (isMinimized) return; // allow click-only when minimized
            const rect = containerRef.current?.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            setDragOffset({ x: offsetX, y: offsetY });
            setIsDragging(true);
          }}
          onTouchStart={(e) => {
            if (isMinimized) return;
            const rect = containerRef.current?.getBoundingClientRect();
            const touch = e.touches[0];
            const offsetX = touch.clientX - rect.left;
            const offsetY = touch.clientY - rect.top;
            setDragOffset({ x: offsetX, y: offsetY });
            setIsDragging(true);
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className={`font-semibold text-sm ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                AI Assistant
              </h3>
              <p className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {isMinimized ? 'Minimized' : 'Online • Ready to help'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className={`p-1 rounded-full hover:bg-gray-600 transition-colors ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label={isMinimized ? 'Maximize' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1 rounded-full hover:bg-gray-600 transition-colors ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: Math.max(200, size.h - 196) }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'ml-2 bg-blue-500' 
                        : 'mr-2 bg-gradient-to-r from-blue-500 to-purple-600'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.type === 'user'
                        ? isDarkMode
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : isDarkMode
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user'
                          ? 'text-blue-100'
                          : isDarkMode
                            ? 'text-gray-400'
                            : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2 bg-gradient-to-r from-blue-500 to-purple-600">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className={`rounded-2xl px-4 py-2 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className={`text-xs mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Quick questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className={`px-3 py-1 rounded-full text-xs transition-colors ${
                        isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className={`absolute bottom-16 right-4 p-3 rounded-lg shadow-lg border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex flex-wrap gap-2 w-48">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInputMessage(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className={`w-full px-3 py-2 rounded-xl border resize-none transition-colors ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    } focus:outline-none`}
                    rows="1"
                    style={{
                      minHeight: '40px',
                      maxHeight: '120px',
                      height: 'auto'
                    }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      showEmojiPicker
                        ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                        : isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'
                    }`}
                    aria-label="Add emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleVoiceInput}
                    disabled={isListening}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isListening
                        ? isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
                        : isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'
                    }`}
                    aria-label="Voice input"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      !inputMessage.trim() || isLoading
                        ? isDarkMode
                          ? 'bg-gray-600 text-gray-400'
                          : 'bg-gray-300 text-gray-500'
                        : isDarkMode
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                    }`}
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Resize handle (bottom-right) */}
      {!isMinimized && (
        <div
          className="absolute w-4 h-4 right-1 bottom-1 cursor-se-resize opacity-70"
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsResizing(true);
            setResizeStart({ w: size.w, h: size.h, x: e.clientX, y: e.clientY });
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            const t = e.touches[0];
            setIsResizing(true);
            setResizeStart({ w: size.w, h: size.h, x: t.clientX, y: t.clientY });
          }}
        >
          <div className="w-full h-full border-r-2 border-b-2 border-gray-400 dark:border-gray-500 rounded-sm" />
        </div>
      )}
    </div>
  );
};

export default ChatBotEnhanced;
