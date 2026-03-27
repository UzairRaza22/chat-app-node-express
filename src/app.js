require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authroutes');
const workspaceRoutes = require('./routes/workspaces');
const { errorHandler } = require('./middlewares/CheckValidationMiddleware');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
