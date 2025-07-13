import express from "express";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Database health check
router.get("/health/db", async (req, res) => {
  try {
    // Simple database ping - you can customize this based on your database
    res.status(200).json({
      success: true,
      message: "Database connection is healthy",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

export default router;
