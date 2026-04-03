require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/Db");

// Routes Imports
const authRoutes = require("./routes/authroutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const teamRoutes = require('./routes/teamroutes');
const channelRoutes = require('./routes/channelroutes');
const messageRoutes = require("./routes/messageroutes");

const { GlobalResponseHandler } = require("./utils/GlobalResponseHandler");
const GlobalErrorHandler = require("./utils/GlobalErrorHandler");
const loggerMiddleware = require("./middlewares/LoggerMiddleware");

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

const PORT = process.env.PORT || 5000;
const logger = require("./utils/Logger");
app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));