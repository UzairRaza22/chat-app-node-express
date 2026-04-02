require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const channelRoutes = require("./routes/channelroutes");
const messageRoutes = require("./routes/messageroutes");
const teamRoutes = require("./routes/teamroutes");

const {
  errorHandler,
  successResponse,
} = require("./middlewares/responsehandlermiddleware");
const loggerMiddleware = require("./middlewares/loggermiddleware");

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
app.use(successResponse);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/teams", teamRoutes);

// Error Handler (should be last)
app.use(errorHandler);

const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
});
