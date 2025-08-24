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

// Get available games
router.get("/", async (req, res) => {
  try {
    const games = [
      {
        id: 1,
        title: 'Coin Collector',
        category: 'arcade',
        image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        coins: 50,
        difficulty: 'Easy',
        players: 1247,
        rating: 4.5,
        duration: '5-10 min',
        description: 'Collect golden coins while avoiding obstacles',
        instructions: 'Use arrow keys to move and collect coins. Avoid red obstacles!'
      },
      {
        id: 2,
        title: 'Puzzle Master',
        category: 'puzzle',
        image: 'https://images.pexels.com/photos/276452/pexels-photo-276452.jpeg',
        coins: 75,
        difficulty: 'Medium',
        players: 892,
        rating: 4.7,
        duration: '10-15 min',
        description: 'Solve challenging puzzles to unlock rewards',
        instructions: 'Match the patterns and solve the puzzle to win!'
      },
      {
        id: 3,
        title: 'Speed Runner',
        category: 'arcade',
        image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
        coins: 100,
        difficulty: 'Hard',
        players: 634,
        rating: 4.3,
        duration: '3-8 min',
        description: 'Race against time in this fast-paced runner',
        instructions: 'Run as fast as you can and avoid obstacles!'
      },
      {
        id: 4,
        title: 'Memory Game',
        category: 'puzzle',
        image: 'https://images.pexels.com/photos/207924/pexels-photo-207924.jpeg',
        coins: 60,
        difficulty: 'Easy',
        players: 1156,
        rating: 4.6,
        duration: '5-12 min',
        description: 'Test your memory with colorful patterns',
        instructions: 'Remember the pattern and repeat it correctly!'
      },
      {
        id: 5,
        title: 'Tower Defense',
        category: 'strategy',
        image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
        coins: 120,
        difficulty: 'Hard',
        players: 456,
        rating: 4.8,
        duration: '15-25 min',
        description: 'Defend your base against waves of enemies',
        instructions: 'Build towers and defend your territory!'
      },
      {
        id: 6,
        title: 'Color Match',
        category: 'puzzle',
        image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        coins: 40,
        difficulty: 'Easy',
        players: 892,
        rating: 4.2,
        duration: '3-7 min',
        description: 'Match colors in this relaxing puzzle game',
        instructions: 'Match three or more colors to clear them!'
      }
    ];

    res.json({ games });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start a game
router.post("/start", authenticateToken, async (req, res) => {
  try {
    const { gameId } = req.body;
    
    if (!gameId) {
      return res.status(400).json({ message: "Game ID is required" });
    }

    // In a real implementation, you might want to track active games
    // For now, we'll just return success
    res.json({ 
      message: "Game started successfully",
      gameId,
      startTime: new Date()
    });

  } catch (error) {
    console.error('Start game error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Complete a game
router.post("/complete", authenticateToken, async (req, res) => {
  try {
    const { gameId, score, duration, won } = req.body;
    
    if (!gameId) {
      return res.status(400).json({ message: "Game ID is required" });
    }

    // Update user statistics
    const user = await User.findById(req.user._id);
    
    user.gamesPlayed += 1;
    if (won) {
      user.gamesWon += 1;
    }
    
    if (duration) {
      user.totalPlayTime += Math.floor(duration / 60); // Convert to minutes
    }

    // Calculate rewards based on game and performance
    const gameRewards = {
      1: { base: 50, bonus: 25 },   // Coin Collector
      2: { base: 75, bonus: 35 },   // Puzzle Master
      3: { base: 100, bonus: 50 },  // Speed Runner
      4: { base: 60, bonus: 30 },   // Memory Game
      5: { base: 120, bonus: 60 },  // Tower Defense
      6: { base: 40, bonus: 20 }    // Color Match
    };

    const gameReward = gameRewards[gameId] || { base: 50, bonus: 25 };
    let coinsEarned = gameReward.base;
    
    if (won && score > 0) {
      coinsEarned += gameReward.bonus;
    }

    // Add XP based on performance
    let xpEarned = 50; // Base XP
    if (won) xpEarned += 50;
    if (score > 1000) xpEarned += 25;

    await user.addCoins(coinsEarned);
    await user.addXP(xpEarned);

    const leveledUp = user.level > req.user.level;

    res.json({
      message: "Game completed successfully",
      rewards: {
        coins: coinsEarned,
        xp: xpEarned,
        newBalance: user.coins,
        newXP: user.xp,
        newLevel: user.level,
        leveledUp,
        levelUpBonus: leveledUp ? user.level * 100 : 0
      },
      stats: {
        gamesPlayed: user.gamesPlayed,
        gamesWon: user.gamesWon,
        winRate: user.winRate,
        totalPlayTime: user.totalPlayTime
      }
    });

  } catch (error) {
    console.error('Complete game error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's game statistics
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const stats = {
      gamesPlayed: req.user.gamesPlayed,
      gamesWon: req.user.gamesWon,
      winRate: req.user.winRate,
      totalPlayTime: req.user.totalPlayTime,
      averagePlayTime: req.user.gamesPlayed > 0 
        ? Math.round(req.user.totalPlayTime / req.user.gamesPlayed) 
        : 0
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get game stats error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get game categories
router.get("/categories", async (req, res) => {
  try {
    const categories = [
      { id: 'all', name: 'All Games', count: 6 },
      { id: 'arcade', name: 'Arcade', count: 2 },
      { id: 'puzzle', name: 'Puzzle', count: 3 },
      { id: 'strategy', name: 'Strategy', count: 1 }
    ];

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
