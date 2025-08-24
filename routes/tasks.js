import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies?.bolt_token || req.headers.authorization?.split(' ')[1];
    
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

// Get available tasks
router.get("/", authenticateToken, async (req, res) => {
  try {
    const dailyTasks = [
      {
        id: 1,
        title: 'Complete 3 Games',
        description: 'Play any 3 games to completion',
        coins: 150,
        progress: Math.min(req.user.gamesPlayed % 3, 3),
        total: 3,
        type: 'daily',
        category: 'gaming'
      },
      {
        id: 2,
        title: 'Login Streak',
        description: 'Maintain your daily login streak',
        coins: 100,
        progress: req.user.currentStreak,
        total: 7,
        type: 'daily',
        category: 'streak'
      },
      {
        id: 3,
        title: 'Earn 500 Coins',
        description: 'Earn 500 coins through any activity',
        coins: 200,
        progress: Math.min(req.user.lifetimeCoins - 1000, 500),
        total: 500,
        type: 'daily',
        category: 'earning'
      },
      {
        id: 4,
        title: 'Win 2 Games',
        description: 'Win 2 games today',
        coins: 300,
        progress: Math.min(req.user.gamesWon % 2, 2),
        total: 2,
        type: 'daily',
        category: 'gaming'
      },
      {
        id: 5,
        title: 'Play for 30 Minutes',
        description: 'Spend 30 minutes playing games',
        coins: 250,
        progress: Math.min(req.user.totalPlayTime % 30, 30),
        total: 30,
        type: 'daily',
        category: 'time'
      }
    ];

    const weeklyTasks = [
      {
        id: 6,
        title: 'Invite Friends',
        description: 'Invite 2 friends to join Bolt',
        coins: 500,
        progress: Math.min(req.user.friends.length, 2),
        total: 2,
        type: 'weekly',
        category: 'social'
      },
      {
        id: 7,
        title: 'Spend Coins',
        description: 'Purchase any item from shop',
        coins: 200,
        progress: 0, // This would need to be tracked separately
        total: 1,
        type: 'weekly',
        category: 'shopping'
      },
      {
        id: 8,
        title: 'Reach Level 5',
        description: 'Reach level 5 or higher',
        coins: 1000,
        progress: Math.min(req.user.level, 5),
        total: 5,
        type: 'weekly',
        category: 'progression'
      },
      {
        id: 9,
        title: 'Complete 10 Games',
        description: 'Complete 10 games this week',
        coins: 400,
        progress: Math.min(req.user.gamesPlayed % 10, 10),
        total: 10,
        type: 'weekly',
        category: 'gaming'
      },
      {
        id: 10,
        title: '7-Day Streak',
        description: 'Maintain a 7-day login streak',
        coins: 750,
        progress: Math.min(req.user.currentStreak, 7),
        total: 7,
        type: 'weekly',
        category: 'streak'
      }
    ];

    res.json({ 
      dailyTasks,
      weeklyTasks,
      userStats: {
        dailyTasksCompleted: req.user.dailyTasksCompleted,
        weeklyTasksCompleted: req.user.weeklyTasksCompleted,
        totalTasksCompleted: req.user.tasksCompleted
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Complete a task
router.post("/complete", authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.body;
    
    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    // Get task details (in a real app, this would come from a database)
    const taskRewards = {
      1: { coins: 150, xp: 100 },   // Complete 3 Games
      2: { coins: 100, xp: 75 },    // Login Streak
      3: { coins: 200, xp: 150 },   // Earn 500 Coins
      4: { coins: 300, xp: 200 },   // Win 2 Games
      5: { coins: 250, xp: 175 },   // Play for 30 Minutes
      6: { coins: 500, xp: 300 },   // Invite Friends
      7: { coins: 200, xp: 150 },   // Spend Coins
      8: { coins: 1000, xp: 500 },  // Reach Level 5
      9: { coins: 400, xp: 250 },   // Complete 10 Games
      10: { coins: 750, xp: 400 }   // 7-Day Streak
    };

    const taskReward = taskRewards[taskId];
    if (!taskReward) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    // Update user
    const user = await User.findById(req.user._id);
    
    await user.addCoins(taskReward.coins);
    await user.addXP(taskReward.xp);
    
    user.tasksCompleted += 1;
    
    // Determine if it's daily or weekly task
    if (taskId <= 5) {
      user.dailyTasksCompleted += 1;
    } else {
      user.weeklyTasksCompleted += 1;
    }

    await user.save();

    const leveledUp = user.level > req.user.level;

    res.json({
      message: "Task completed successfully",
      rewards: {
        coins: taskReward.coins,
        xp: taskReward.xp,
        newBalance: user.coins,
        newXP: user.xp,
        newLevel: user.level,
        leveledUp,
        levelUpBonus: leveledUp ? user.level * 100 : 0
      },
      stats: {
        tasksCompleted: user.tasksCompleted,
        dailyTasksCompleted: user.dailyTasksCompleted,
        weeklyTasksCompleted: user.weeklyTasksCompleted
      }
    });

  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get task categories
router.get("/categories", async (req, res) => {
  try {
    const categories = [
      { id: 'all', name: 'All Tasks', count: 10 },
      { id: 'daily', name: 'Daily Tasks', count: 5 },
      { id: 'weekly', name: 'Weekly Tasks', count: 5 },
      { id: 'gaming', name: 'Gaming', count: 3 },
      { id: 'streak', name: 'Streaks', count: 2 },
      { id: 'social', name: 'Social', count: 1 },
      { id: 'progression', name: 'Progression', count: 1 }
    ];

    res.json({ categories });
  } catch (error) {
    console.error('Get task categories error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's task statistics
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const stats = {
      totalTasksCompleted: req.user.tasksCompleted,
      dailyTasksCompleted: req.user.dailyTasksCompleted,
      weeklyTasksCompleted: req.user.weeklyTasksCompleted,
      completionRate: req.user.tasksCompleted > 0 
        ? Math.round((req.user.tasksCompleted / (req.user.dailyTasksCompleted + req.user.weeklyTasksCompleted)) * 100)
        : 0
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
