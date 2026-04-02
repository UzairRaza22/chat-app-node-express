<<<<<<< HEAD
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const workspaceRoutes = require("./routes/workspaceroutes");
const channelRoutes = require("./routes/channelroutes");
const messageRoutes = require("./routes/messageroutes");
const teamRoutes = require("./routes/teamroutes");

// ✅ Import ONLY once
const {
  errorHandler,
  successResponse,
} = require("./middlewares/responsehandlermiddleware");
=======
require('dotenv').config();

const express = require('express');

const cors = require('cors');

const connectDB = require('./Config/db');

const authRoutes = require('./Routes/authRoutes');

const workspaceRoutes = require('./Routes/workspaceRoutes');

const channelRoutes = require('./Routes/channelRoutes');

const teamRoutes = require('./Routes/teamRoutes');

const invitationAuthRoutes = require('./Routes/invitationAuthRoutes');

const errorHandler = require('./Middlewares/ErrorHandlerMiddleware');
>>>>>>> b89fd9a5ed63ea4e0854216ac6d27f5d043ecb5b



const app = express();



// Connect Database

connectDB();

<<<<<<< HEAD
// Middlewares
app.use(cors());
app.use(express.json());
app.use(successResponse);
=======


// Init Middleware
>>>>>>> b89fd9a5ed63ea4e0854216ac6d27f5d043ecb5b

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/teams", teamRoutes);
app.use(cors());

<<<<<<< HEAD
// Error Handler (should be last)
=======
app.use(express.json());

<<<<<<< HEAD


=======
app.use(cors());

app.use(express.json());
>>>>>>> 95766a890e7489a0f6b2707fe389470b9cf3b4d5
// Define Routes

app.use('/api/auth', authRoutes);

app.use('/api/invitations', invitationAuthRoutes);

app.use('/api/workspaces', workspaceRoutes);

app.use('/api/channels', channelRoutes);

app.use('/api/teams', teamRoutes);



>>>>>>> b89fd9a5ed63ea4e0854216ac6d27f5d043ecb5b
app.use(errorHandler);



const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
<<<<<<< HEAD
  console.log(`Server started on port ${PORT}`);
=======

    console.log(`Server started on port ${PORT}`);

>>>>>>> b89fd9a5ed63ea4e0854216ac6d27f5d043ecb5b
});

