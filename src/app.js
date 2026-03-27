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
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/message.routes");
const {
  errorHandler,
  successResponse,
} = require("./middlewares/validation.middleware");

const app = express();

// Connect Database
connectDB();

// Init Middleware
connectDB();

app.use(express.json());
app.use(successResponse);

// Define Routes
app.use('/api/auth', authRoutes);
<<<<<<< HEAD
app.use('/api/workspaces', workspaceRoutes);
=======
app.use('/api/channels', channelRoutes);
>>>>>>> 2c483de1fe5bd0b4378c1fabeb59284621ee3aff
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
