import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { username, avatarUrl, notifications, theme } = req.body;
    const updates = {};

    // Only allow updating specific fields
    if (username && username !== req.user.username) {
      // Check if username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      updates.username = username;
    }

    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;
    if (notifications !== undefined) updates.notifications = notifications;
    if (theme !== undefined) updates.theme = theme;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ 
      user: updatedUser,
      message: "Profile updated successfully" 
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user statistics
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const stats = {
      level: req.user.level,
      xp: req.user.xp,
      coins: req.user.coins,
      lifetimeCoins: req.user.lifetimeCoins,
      currentStreak: req.user.currentStreak,
      longestStreak: req.user.longestStreak,
      gamesPlayed: req.user.gamesPlayed,
      gamesWon: req.user.gamesWon,
      winRate: req.user.winRate,
      totalPlayTime: req.user.totalPlayTime,
      tasksCompleted: req.user.tasksCompleted,
      dailyTasksCompleted: req.user.dailyTasksCompleted,
      weeklyTasksCompleted: req.user.weeklyTasksCompleted,
      friendsCount: req.user.friends.length,
      rank: await getRank(req.user._id)
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const { type = 'coins', limit = 50 } = req.query;
    
    let sortField = 'coins';
    if (type === 'level') sortField = 'level';
    if (type === 'streak') sortField = 'longestStreak';
    if (type === 'games') sortField = 'gamesPlayed';

    const leaderboard = await User.find()
      .select('username level coins longestStreak gamesPlayed avatarUrl')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add coins to user
router.post("/coins/add", authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    await req.user.addCoins(amount);
    
    res.json({ 
      message: "Coins added successfully",
      newBalance: req.user.coins
    });

  } catch (error) {
    console.error('Add coins error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add XP to user
router.post("/xp/add", authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const oldLevel = req.user.level;
    await req.user.addXP(amount);
    
    const leveledUp = req.user.level > oldLevel;
    
    res.json({ 
      message: "XP added successfully",
      newXP: req.user.xp,
      newLevel: req.user.level,
      leveledUp,
      levelUpBonus: leveledUp ? req.user.level * 100 : 0
    });

  } catch (error) {
    console.error('Add XP error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper function to get user rank
async function getRank(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const rank = await User.countDocuments({ coins: { $gt: user.coins } });
    return rank + 1;
  } catch (error) {
    console.error('Get rank error:', error);
    return null;
  }
}

export default router;
