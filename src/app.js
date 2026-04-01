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



const app = express();



// Connect Database

connectDB();



// Init Middleware

app.use(cors());

app.use(express.json());



// Define Routes

app.use('/api/auth', authRoutes);

app.use('/api/invitations', invitationAuthRoutes);

app.use('/api/workspaces', workspaceRoutes);

app.use('/api/channels', channelRoutes);

app.use('/api/teams', teamRoutes);



app.use(errorHandler);



const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {

    console.log(`Server started on port ${PORT}`);

});

