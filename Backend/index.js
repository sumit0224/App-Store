require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/auth');
const appsRoutes = require('./src/routes/apps');
const devRoutes = require('./src/routes/dev');
const adminRoutes = require('./src/routes/admin');
const chatbotRoutes = require('./src/routes/chatbot');
const profileRoutes = require('./src/routes/profile');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('FATAL ERROR: Failed to connect to the database.', err);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'API is running successfully!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/apps', appsRoutes);    // public & app-related routes
app.use('/api/dev', devRoutes);      // developer routes
app.use('/api/admin', adminRoutes);  // admin routes
app.use('/api/chatbot', chatbotRoutes); // chatbot routes
app.use('/api/profile', profileRoutes); // profile routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
  console.log(`Access it at http://localhost:${PORT}`);
});
