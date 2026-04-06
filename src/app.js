require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/Db");

// Routes Imports
const authRoutes = require("./routes/authroutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const teamRoutes = require("./routes/teamroutes");
const channelRoutes = require("./routes/channelroutes");
const messageRoutes = require("./routes/messageroutes");

const { GlobalResponseHandler } = require("./utils/GlobalResponseHandler");
const GlobalErrorHandler = require("./utils/GlobalErrorHandler");
const loggerMiddleware = require("./middlewares/LoggerMiddleware");
const sendErrorToWebhook = require("./utils/WebhookService");

const app = express();

// Database Connection
connectDB();

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// ✅ Attaches res.success() and res.failed() to every request
app.use(GlobalResponseHandler);

// Routes Registration
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);

app.use(GlobalErrorHandler);

process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err);
  sendErrorToWebhook(err); // report to webhook
  process.exit(1); // exit — let process manager restart
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("[unhandledRejection] at:", promise, "reason:", reason);
  const err = reason instanceof Error ? reason : new Error(String(reason));
  sendErrorToWebhook(err); // report to webhook, no req context available
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
