const express = require('express');
const router = express.Router();

// Simple AI-like responses for the chatbot
const getChatbotResponse = (message, context = 'app_store') => {
  const lowerMessage = message.toLowerCase();
  
  // App Store related responses
  if (lowerMessage.includes('download') || lowerMessage.includes('install')) {
    return "To download an app, simply click on the app you want, then click the 'Download' button on the app detail page. You'll need to be logged in to download apps.";
  }
  
  if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
    return "You can search for apps using the search bar at the top of the page. Try searching by app name, category, or keywords related to what you're looking for.";
  }
  
  if (lowerMessage.includes('trending') || lowerMessage.includes('popular')) {
    return "Trending apps are displayed on the home page and are based on recent downloads and user activity. Check the 'Trending Apps' section to see what's popular right now.";
  }
  
  if (lowerMessage.includes('category') || lowerMessage.includes('categories')) {
    return "We have several app categories including Productivity, Games, Tools, Education, and Entertainment. You can filter apps by category using the category buttons on the home page.";
  }
  
  if (lowerMessage.includes('developer') || lowerMessage.includes('publish') || lowerMessage.includes('upload')) {
    return "To become a developer and publish apps, you need to sign up with a developer account. Go to the signup page and select 'Developer' as your role. Then you can access the developer dashboard to upload and manage your apps.";
  }
  
  if (lowerMessage.includes('review') || lowerMessage.includes('rating')) {
    return "You can review and rate apps by going to the app detail page and clicking 'Write a Review'. Your reviews help other users make informed decisions.";
  }
  
  if (lowerMessage.includes('account') || lowerMessage.includes('profile')) {
    return "You can manage your account by going to your dashboard. From there, you can view your downloaded apps, reviews, and account settings.";
  }
  
  if (lowerMessage.includes('admin') || lowerMessage.includes('administrator')) {
    return "Admin features include managing all apps, users, and system settings. Admin access is granted to authorized personnel only.";
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return "I'm here to help! You can ask me about downloading apps, searching, categories, becoming a developer, reviews, or any other app store related questions.";
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! Welcome to the App Store! I'm your AI assistant. How can I help you today? You can ask me about apps, downloads, categories, or becoming a developer.";
  }
  
  if (lowerMessage.includes('thank')) {
    return "You're welcome! I'm happy to help. Feel free to ask me anything else about the App Store.";
  }
  
  // Default response for unrecognized queries
  const defaultResponses = [
    "I understand you're asking about something related to the App Store. Could you be more specific? I can help with app downloads, searching, categories, developer features, and more.",
    "That's an interesting question! I can help you with app-related topics like finding apps, downloading them, becoming a developer, or navigating the store. What would you like to know more about?",
    "I'm here to help with App Store related questions. Try asking about specific topics like 'How do I download an app?' or 'What categories are available?'"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

// Get contextual suggestions based on current page
const getSuggestions = (page = 'home') => {
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
  
  return suggestions[page] || suggestions.home;
};

// POST /api/chatbot - Send message to chatbot
router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = getChatbotResponse(message, context);
    
    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
      context
    });
    
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'Failed to process chatbot request',
      response: 'Sorry, I encountered an error. Please try again later.'
    });
  }
});

// GET /api/chatbot/suggestions - Get contextual suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { page = 'home' } = req.query;
    
    const suggestions = getSuggestions(page);
    
    res.json({
      success: true,
      suggestions,
      page
    });
    
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ 
      error: 'Failed to get suggestions',
      suggestions: getSuggestions('home')
    });
  }
});

// GET /api/chatbot/status - Check chatbot status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;
