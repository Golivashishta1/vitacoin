import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { MongoMemoryServer } from "mongodb-memory-server";

import authRoutes from "../routes/auth.js";
import userRoutes from "../routes/user.js";
import gameRoutes from "../routes/games.js";
import taskRoutes from "../routes/tasks.js";
import shopRoutes from "../routes/shop.js";

dotenv.config();
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bolt server is running!' });
});

import User from "../models/User.js"; // fixed path

app.get("/test-user", async (req, res) => {
  try {
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "123456"
    });
    await user.save();
    res.json({ message: "User created!", user });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/shop", shopRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
const ENV_MONGO_URI = process.env.MONGO_URI;

async function startServer() {
  try {
    let mongoUriToUse = ENV_MONGO_URI;

    if (!mongoUriToUse) {
      console.log("ℹ️  MONGO_URI not set. Starting in-memory MongoDB...");
      const mem = await MongoMemoryServer.create();
      mongoUriToUse = mem.getUri();
      console.log("✅ In-memory MongoDB started");
    }

    await mongoose.connect(mongoUriToUse, {});
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Bolt server running on port ${PORT}`);
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    // Try fallback if not already attempted
    if (ENV_MONGO_URI) {
      try {
        console.log("🧪 Retrying with in-memory MongoDB fallback...");
        const mem = await MongoMemoryServer.create();
        const fallbackUri = mem.getUri();
        await mongoose.connect(fallbackUri, {});
        console.log('✅ Connected to in-memory MongoDB');
        app.listen(PORT, () => {
          console.log(`🚀 Bolt server running on port ${PORT}`);
          console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
        });
      } catch (fallbackErr) {
        console.error("❌ Fallback in-memory MongoDB failed:", fallbackErr);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}

startServer();
