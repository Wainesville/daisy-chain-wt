const express = require('express');
const cors = require('cors');
const multer = require('multer'); // Middleware for handling file uploads
const authenticate = require('./middleware/authenticate'); // Adjust path if needed
require('dotenv').config();
const pool = require('./db'); // Import the database pool

// console.log('Type of authenticate:', typeof authenticate); // Remove this line

const app = express();
const PORT = process.env.PORT || 5000;

const path = require('path');

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration with multer (for profile picture handling)
const upload = multer({ dest: 'uploads/' }); // You can customize this path

// Import Routes
const authRoutes = require('./routes/auth');
const watchlistRoutes = require('./routes/watchlistRoutes');
const movieRoutes = require('./routes/movieRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const userRoutes = require('./routes/userRoutes'); // Ensure userRoutes is imported
const recommendationRoutes = require('./routes/recommendationRoutes'); // Add this line

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/watchlist', authenticate, watchlistRoutes); // Ensure authentication middleware is used
app.use('/api/movies', movieRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/users', userRoutes); // Ensure userRoutes is used
app.use('/api/recommendations', authenticate, recommendationRoutes); // Add this line

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error executing query', err.stack);
    } else {
        console.log('Database connected:', res.rows[0]);
    }
});