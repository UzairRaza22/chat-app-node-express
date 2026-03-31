require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/AuthRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const channelRoutes = require('./routes/channelroutes');
const teamRoutes = require('./routes/teamroutes');
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

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server started on port ${PORT}`);

});