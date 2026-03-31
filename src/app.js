require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const channelRoutes = require("./routes/ChannelRoutes");
const messageRoutes = require("./routes/messageroutes");

// ✅ Import ONLY once
const {
  errorHandler,
  successResponse,
} = require("./middlewares/Messages/ValidationMiddleware");

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(successResponse);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);

// Error Handler (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
