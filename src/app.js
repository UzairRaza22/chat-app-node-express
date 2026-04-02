require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const workspaceRoutes = require("./routes/workspaceroutes");
const channelRoutes = require("./routes/channelroutes");
const messageRoutes = require("./routes/messageroutes");

const GlobalResponseHandler = require("./utils/GlobalResponseHandler");
const GlobalErrorHandler = require("./utils/GlobalErrorHandler");
const loggerMiddleware = require("./middlewares/loggermiddleware");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// ✅ Attaches res.success() and res.failed() to every request
app.use(GlobalResponseHandler);

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Catches all next(err) calls from every module — registered last
app.use(GlobalErrorHandler);

const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
