const express = require('express');
const authRoutes = require('./routes/authroutes');
const { errorHandler } = require('./middlewares/CheckValidationMiddleware');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Error Handler (must be last)
app.use(errorHandler);

module.exports = app;
