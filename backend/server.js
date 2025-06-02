const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Database configuration
const { testConnection, initializeDatabase } = require('./config/database');
const { router: waitlistRoutes, setDbStatus } = require('./routes/waitlist');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database connection
(async () => {
  const isConnected = await testConnection();
  setDbStatus(isConnected);
  
  if (isConnected) {
    await initializeDatabase();
  } else {
    console.log('Running with in-memory storage as fallback');
  }
})();

// Routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Register API routes
app.use('/api', waitlistRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});