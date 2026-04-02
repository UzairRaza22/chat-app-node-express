require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// Routes Imports
const authRoutes = require("./routes/authroutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const teamRoutes = require("./routes/teamRoutes");
const channelRoutes = require("./routes/ChannelRoutes");
const messageRoutes = require("./routes/messageroutes");

const { GlobalResponseHandler } = require("./utils/GlobalResponseHandler");
const GlobalErrorHandler = require("./utils/GlobalErrorHandler");
const loggerMiddleware = require("./middlewares/loggermiddleware");

const app = express();

// Database Connection
connectDB();

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// ✅ 3. Attaches res.success() and res.failed() - Registered BEFORE routes
app.use(GlobalResponseHandler);

// Routes Registration
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/teams", teamRoutes); 
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);

app.use(GlobalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));