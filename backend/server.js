const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");
require("./models"); // Load models & associations
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    // Dynamically accepts the live Netlify URL once set in Render, or defaults to local development
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes); // Consolidated duplicate routes

// Health check routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Resume Screener API is running",
  });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Resume Screener API is running securely!" });
});

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully.");

    // Syncs models without dropping existing tables
    await sequelize.sync({ alter: true });
    console.log("Database models synced.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to MySQL:", error.message);
    process.exit(1);
  }
};

startServer();
