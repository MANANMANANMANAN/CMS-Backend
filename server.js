const path = require("path");
const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const usefulRoutes = require("./routes/UsefulRoutes");

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
// Enable CORS for all origins temporarily (change to frontend URL in production)
app.use(cors({
  origin: process.env.FRONTEND_URL || "*"  // e.g., "https://myapp.vercel.app"
}));
app.use(express.json());

// API routes
app.use("/api/faculty_service", usefulRoutes);

// Test route
app.get("/api", (req, res) => {
  res.send("Backend running!");
});

// Optional: serve frontend build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // Catch-all for SPA routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  });
}

// Dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
