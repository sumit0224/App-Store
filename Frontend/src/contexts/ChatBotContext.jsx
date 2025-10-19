import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatBotContext = createContext();

export const useChatBot = () => {
  const context = useContext(ChatBotContext);
  if (!context) {
    throw new Error('useChatBot must be used within a ChatBotProvider');
  }
  return context;
};

export const ChatBotProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = useCallback((message) => {
    setChatHistory(prev => [...prev, {
      ...message,
      id: Date.now(),
      timestamp: new Date()
    }]);
  }, []);

  const clearHistory = useCallback(() => {
    setChatHistory([]);
  }, []);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  const setTyping = useCallback((typing) => {
    setIsTyping(typing);
  }, []);

  const getContextualSuggestions = useCallback((currentPage) => {
    const suggestions = {
      home: [
        "What are the featured apps?",
        "Show me trending apps",
        "How do I search for apps?",
        "What categories are available?"
      ],
      app: [
        "How do I download this app?",
        "What are the app requirements?",
        "Show me similar apps",
        "How do I rate this app?"
      ],
      developer: [
        "How do I upload an app?",
        "What are the developer guidelines?",
        "How do I manage my apps?",
        "What are the revenue options?"
      ],
      admin: [
        "Show me app analytics",
        "How do I manage users?",
        "What are pending approvals?",
        "Show me system statistics"
      ]
    };
    
    return suggestions[currentPage] || suggestions.home;
  }, []);

  const getAppStoreContext = useCallback(() => {
    return {
      platform: "App Store",
      features: [
        "App browsing and search",
        "User registration and authentication",
        "Developer dashboard",
        "Admin panel",
        "App reviews and ratings",
        "File uploads and management"
      ],
      categories: [
        "Productivity",
        "Games", 
        "Tools",
        "Education",
        "Entertainment"
      ]
    };
  }, []);

  const contextValue = {
    isVisible,
    chatHistory,
    isTyping,
    addMessage,
    clearHistory,
    toggleVisibility,
    setTyping,
    getContextualSuggestions,
    getAppStoreContext
  };

  return (
    <ChatBotContext.Provider value={contextValue}>
      {children}
    </ChatBotContext.Provider>
  );
};

export default ChatBotContext;
