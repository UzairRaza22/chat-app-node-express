require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const workspaceRoutes = require("./routes/workspaces");
const channelRoutes = require("./routes/ChannelRoutes");
const messageRoutes = require("./routes/message.routes");

// ✅ Import ONLY once
const {
  errorHandler,
  successResponse,
} = require("./middlewares/validation.middleware");

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

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
