require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const workspaceRoutes = require("./routes/workspaces");
const channelRoutes = require("./routes/ChannelRoutes");
const { errorHandler } = require("./Middlewares/CheckValidationMiddleware");
const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/message.routes");
const {
  errorHandler,
  successResponse,
} = require("./middlewares/validation.middleware");

const app = express();

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());
app.use(successResponse);

// Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
