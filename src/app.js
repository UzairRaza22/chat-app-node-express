require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const channelRoutes = require("./routes/ChannelRoutes");
const messageRoutes = require("./routes/messageroutes");

const GlobalResponseHandler = require("./utils/GlobalResponseHandler");
const GlobalErrorHandler = require("./utils/GlobalErrorHandler");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// ✅ Attaches res.success() and res.failed() to every request
app.use(GlobalResponseHandler);

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Catches all next(err) calls from every module — registered last
app.use(GlobalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
