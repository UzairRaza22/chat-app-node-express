require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/message.routes");
const {
  errorHandler,
  successResponse,
} = require("./middlewares/validation.middleware");

const app = express();

connectDB();

app.use(express.json());
app.use(successResponse);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
