import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const router = express.Router();

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

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1d' }
  );
};

// Helper function to send user response (without password)
const sendUserResponse = (user, token, res) => {
  const userResponse = {
    _id: user._id,
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

// Signup
router.post("/signup", validateSignup, async (req, res) => {
  try {
    console.log('Signup route called');
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;
    console.log('Signup data:', { username, email });

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    console.log('Existing user:', existingUser);
    if (existingUser) {
      console.log('User already exists:', existingUser.email === email ? 'Email' : 'Username');
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? "Email already registered" 
          : "Username already taken"
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Password hashed');

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      coins: 1000, // Welcome bonus
      lifetimeCoins: 1000
    });
    console.log('User object created:', user);

    await user.save();
    console.log('User saved to DB');

    // Generate token
    const token = generateToken(user._id);
    console.log('JWT token generated');

    // Set HTTP-only cookie (1 day)
    res.cookie('bolt_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    // Update login streak
    await user.updateStreak();
    console.log('Login streak updated');

    sendUserResponse(user, token, res);
    console.log('Signup response sent');

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: "Server error during signup",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login
router.post("/login", validateLogin, async (req, res) => {
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
    const user = await User.findOne({ email });
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

    // Generate token
    const token = generateToken(user._id);

    // Set HTTP-only cookie (1 day)
    res.cookie('bolt_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    // Update login streak
    await user.updateStreak();

    sendUserResponse(user, token, res);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: "Server error during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper to get token from cookie or header
const getTokenFromRequest = (req) => {
  const cookieToken = req.cookies?.bolt_token;
  if (cookieToken) return cookieToken;
  return req.headers.authorization?.split(' ')[1];
};

// Get current user (protected route)
router.get("/me", async (req, res) => {
  try {
    const token = getTokenFromRequest(req);
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    
    console.error('Get user error:', error);
    res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Refresh token
router.post("/refresh", async (req, res) => {
  try {
    const token = getTokenFromRequest(req);
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new token
    const newToken = generateToken(user._id);

    // Update cookie
    res.cookie('bolt_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    sendUserResponse(user, newToken, res);

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    
    console.error('Refresh token error:', error);
    res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Logout: clear cookie
router.post("/logout", (req, res) => {
  res.clearCookie('bolt_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.json({ message: "Logged out successfully" });
});

export default router;
