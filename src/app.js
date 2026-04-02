require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const workspaceRoutes = require("./routes/workspaceroutes");
const channelRoutes = require("./routes/channelroutes");
const messageRoutes = require("./routes/messageroutes");
<<<<<<< HEAD

const GlobalResponseHandler = require("./utils/GlobalResponseHandler");
const GlobalErrorHandler = require("./utils/GlobalErrorHandler");

const app = express();

=======
const teamRoutes = require("./routes/teamroutes");
const invitationRoutes = require("./routes/invitationauthroutes");

const {
  errorHandler,
  successResponse,
} = require("./middlewares/responsehandlermiddleware");
const loggerMiddleware = require("./middlewares/loggermiddleware");

const app = express();

// Connect Database
>>>>>>> d2b2f10aa5b2639ad1371e0633b6ea0103947858
connectDB();

app.use(cors());
app.use(express.json());
<<<<<<< HEAD
=======
app.use(loggerMiddleware);
app.use(successResponse);
>>>>>>> d2b2f10aa5b2639ad1371e0633b6ea0103947858

// ✅ Attaches res.success() and res.failed() to every request
app.use(GlobalResponseHandler);

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);
<<<<<<< HEAD
=======
app.use("/api/teams", teamRoutes);
app.use("/api/invitations", invitationRoutes);
>>>>>>> d2b2f10aa5b2639ad1371e0633b6ea0103947858

// ✅ Catches all next(err) calls from every module — registered last
app.use(GlobalErrorHandler);

const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;
<<<<<<< HEAD
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
=======

app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
});
>>>>>>> d2b2f10aa5b2639ad1371e0633b6ea0103947858
