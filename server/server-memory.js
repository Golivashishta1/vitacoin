import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";

const app = express();

// In-memory storage (for testing without MongoDB)
const users = new Map();
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
    description: 'Collect golden coins while avoiding obstacles'
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
    description: 'Solve challenging puzzles to unlock rewards'
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
    description: 'Race against time in this fast-paced runner'
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
    description: 'Test your memory with colorful patterns'
  }
];

const shopItems = [
  {
    id: 1,
    title: '$10 Amazon Gift Card',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
    coins: 2000,
    discount: 10,
    popular: true,
    category: 'gift-cards',
    description: 'Redeem for $10 Amazon gift card'
  },
  {
    id: 2,
    title: '$5 Starbucks Card',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    coins: 1000,
    discount: 0,
    popular: false,
    category: 'gift-cards',
    description: 'Redeem for $5 Starbucks gift card'
  },
  {
    id: 3,
    title: 'Netflix 1 Month',
    image: 'https://images.pexels.com/photos/1353368/pexels-photo-1353368.jpeg',
    coins: 2500,
    discount: 15,
    popular: true,
    category: 'subscriptions',
    description: '1 month Netflix subscription'
  }
];

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
  origin: process.env.FRONTEND_URL || "http://localhost:5174",
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Bolt server is running! (In-Memory Mode)',
    users: users.size
  });
});

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Helper function to send user response (without password)
const sendUserResponse = (user, token, res) => {
  const userResponse = {
    _id: user.id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    level: user.level,
    xp: user.xp,
    coins: user.coins,
    lifetimeCoins: user.lifetimeCoins,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    gamesPlayed: user.gamesPlayed,
    gamesWon: user.gamesWon,
    tasksCompleted: user.tasksCompleted,
    dailyTasksCompleted: user.dailyTasksCompleted,
    weeklyTasksCompleted: user.weeklyTasksCompleted,
    friends: user.friends,
    notifications: user.notifications,
    theme: user.theme,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  res.json({
    token,
    user: userResponse,
    message: 'Authentication successful'
  });
};

// Validation middleware
const validateSignup = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = users.get(decoded.id);
    
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

// Auth Routes
app.post("/api/auth/signup", validateSignup, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(
      user => user.email === email || user.username === username
    );
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? "Email already registered" 
          : "Username already taken"
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const userId = Date.now().toString();
    const user = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      avatarUrl: null,
      level: 1,
      xp: 0,
      coins: 1000,
      lifetimeCoins: 1000,
      currentStreak: 1,
      longestStreak: 1,
      lastLoginDate: new Date(),
      gamesPlayed: 0,
      gamesWon: 0,
      totalPlayTime: 0,
      tasksCompleted: 0,
      dailyTasksCompleted: 0,
      weeklyTasksCompleted: 0,
      friends: [],
      friendRequests: [],
      notifications: true,
      theme: 'dark',
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.set(userId, user);

    // Generate token
    const token = generateToken(userId);

    sendUserResponse(user, token, res);

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: "Server error during signup",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post("/api/auth/login", validateLogin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = Array.from(users.values()).find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Update login streak
    const today = new Date();
    const lastLogin = new Date(user.lastLoginDate);
    const daysDiff = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      user.currentStreak += 1;
      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }
    } else if (daysDiff > 1) {
      user.currentStreak = 1;
    }
    
    user.lastLoginDate = today;
    user.updatedAt = today;

    // Generate token
    const token = generateToken(user.id);

    sendUserResponse(user, token, res);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: "Server error during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// User Routes
app.get("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/user/stats", authenticateToken, async (req, res) => {
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
      winRate: req.user.gamesPlayed > 0 ? (req.user.gamesWon / req.user.gamesPlayed * 100).toFixed(1) : 0,
      totalPlayTime: req.user.totalPlayTime,
      tasksCompleted: req.user.tasksCompleted,
      dailyTasksCompleted: req.user.dailyTasksCompleted,
      weeklyTasksCompleted: req.user.weeklyTasksCompleted,
      friendsCount: req.user.friends.length,
      rank: 1 // Simple rank for demo
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/user/coins/add", authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    req.user.coins += amount;
    req.user.lifetimeCoins += amount;
    req.user.updatedAt = new Date();

    res.json({ 
      message: "Coins added successfully",
      newBalance: req.user.coins
    });

  } catch (error) {
    console.error('Add coins error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Games Routes
app.get("/api/games", async (req, res) => {
  try {
    res.json({ games });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/games/complete", authenticateToken, async (req, res) => {
  try {
    const { gameId, score, duration, won } = req.body;
    
    if (!gameId) {
      return res.status(400).json({ message: "Game ID is required" });
    }

    // Update user statistics
    req.user.gamesPlayed += 1;
    if (won) {
      req.user.gamesWon += 1;
    }
    
    if (duration) {
      req.user.totalPlayTime += Math.floor(duration / 60);
    }

    // Calculate rewards
    const gameRewards = {
      1: { base: 50, bonus: 25 },
      2: { base: 75, bonus: 35 },
      3: { base: 100, bonus: 50 },
      4: { base: 60, bonus: 30 }
    };

    const gameReward = gameRewards[gameId] || { base: 50, bonus: 25 };
    let coinsEarned = gameReward.base;
    
    if (won && score > 0) {
      coinsEarned += gameReward.bonus;
    }

    // Add XP
    let xpEarned = 50;
    if (won) xpEarned += 50;
    if (score > 1000) xpEarned += 25;

    req.user.coins += coinsEarned;
    req.user.lifetimeCoins += coinsEarned;
    req.user.xp += xpEarned;

    // Check for level up
    const oldLevel = req.user.level;
    const newLevel = Math.floor(req.user.xp / 1000) + 1;
    let leveledUp = false;
    let levelUpBonus = 0;

    if (newLevel > req.user.level) {
      req.user.level = newLevel;
      leveledUp = true;
      levelUpBonus = newLevel * 100;
      req.user.coins += levelUpBonus;
      req.user.lifetimeCoins += levelUpBonus;
    }

    req.user.updatedAt = new Date();

    res.json({
      message: "Game completed successfully",
      rewards: {
        coins: coinsEarned,
        xp: xpEarned,
        newBalance: req.user.coins,
        newXP: req.user.xp,
        newLevel: req.user.level,
        leveledUp,
        levelUpBonus
      },
      stats: {
        gamesPlayed: req.user.gamesPlayed,
        gamesWon: req.user.gamesWon,
        winRate: req.user.gamesPlayed > 0 ? (req.user.gamesWon / req.user.gamesPlayed * 100).toFixed(1) : 0,
        totalPlayTime: req.user.totalPlayTime
      }
    });

  } catch (error) {
    console.error('Complete game error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Shop Routes
app.get("/api/shop", async (req, res) => {
  try {
    res.json({ shopItems });
  } catch (error) {
    console.error('Get shop items error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/shop/purchase", authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.body;
    
    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    const item = shopItems.find(item => item.id === parseInt(itemId));
    if (!item) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    // Check if user has enough coins
    if (req.user.coins < item.coins) {
      return res.status(400).json({ 
        message: "Insufficient coins",
        required: item.coins,
        available: req.user.coins
      });
    }

    // Process purchase
    req.user.coins -= item.coins;
    req.user.updatedAt = new Date();

    res.json({
      message: "Purchase successful",
      item: {
        id: itemId,
        title: item.title,
        coinsSpent: item.coins
      },
      newBalance: req.user.coins
    });

  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Leaderboard
app.get("/api/user/leaderboard", async (req, res) => {
  try {
    const leaderboard = Array.from(users.values())
      .map(user => ({
        username: user.username,
        level: user.level,
        coins: user.coins,
        longestStreak: user.longestStreak,
        gamesPlayed: user.gamesPlayed,
        avatarUrl: user.avatarUrl
      }))
      .sort((a, b) => b.coins - a.coins)
      .slice(0, 50);

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Bolt server running on port ${PORT} (In-Memory Mode)`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5174'}`);
  console.log(`💾 Using in-memory storage (data will be lost on restart)`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
