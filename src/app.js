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
app.use("/api/teams", teamRoutes);
app.use(cors());

// Error Handler (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
