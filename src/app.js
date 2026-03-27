require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/db');
const authRoutes = require('./Routes/AuthRoutes');
const workspaceRoutes = require('./Routes/Workspaces');
const channelRoutes = require('./Routes/ChannelRoutes');
const { errorHandler } = require('./Middlewares/CheckValidationMiddleware');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/channels', channelRoutes);

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
