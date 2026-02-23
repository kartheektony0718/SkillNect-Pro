const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize the app
const app = express();

// Middleware
app.use(cors()); // Allows your React frontend to talk to this backend
app.use(express.json()); // Allows the server to accept JSON data

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));
// Auth Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/interview', require('./routes/interview'));
app.get('/', (req, res) => {
  res.send('SkillNect Backend is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});