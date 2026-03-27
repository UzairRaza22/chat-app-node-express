require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/db');
const authRoutes = require('./Routes/AuthRoutes');
const workspaceRoutes = require('./Routes/WorkspaceRoutes');
const channelRoutes = require('./Routes/ChannelRoutes');
const teamRoutes = require('./Routes/TeamRoutes');
const { errorHandler } = require('./Middlewares/CheckValidationMiddleware');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/teams', teamRoutes);

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
