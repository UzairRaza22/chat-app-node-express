require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
<<<<<<< HEAD
const authRoutes = require('./routes/authroutes');
const workspaceRoutes = require('./routes/workspaces');
const { errorHandler } = require('./middlewares/CheckValidationMiddleware');
=======
const authRoutes = require('./routes/AuthRoutes');
const channelRoutes = require('./routes/ChannelRoutes');
const { errorHandler } = require('./Middlewares/CheckValidationMiddleware');
>>>>>>> 2c483de1fe5bd0b4378c1fabeb59284621ee3aff

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/auth', authRoutes);
<<<<<<< HEAD
app.use('/api/workspaces', workspaceRoutes);
=======
app.use('/api/channels', channelRoutes);
>>>>>>> 2c483de1fe5bd0b4378c1fabeb59284621ee3aff

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
