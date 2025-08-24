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

// Get available shop items
router.get("/", async (req, res) => {
  try {
    const shopItems = [
      {
        id: 1,
        title: '$10 Amazon Gift Card',
        image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
        coins: 2000,
        discount: 10,
        popular: true,
        category: 'gift-cards',
        description: 'Redeem for $10 Amazon gift card',
        available: true,
        stock: 50
      },
      {
        id: 2,
        title: '$5 Starbucks Card',
        image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
        coins: 1000,
        discount: 0,
        popular: false,
        category: 'gift-cards',
        description: 'Redeem for $5 Starbucks gift card',
        available: true,
        stock: 100
      },
      {
        id: 3,
        title: 'Netflix 1 Month',
        image: 'https://images.pexels.com/photos/1353368/pexels-photo-1353368.jpeg',
        coins: 2500,
        discount: 15,
        popular: true,
        category: 'subscriptions',
        description: '1 month Netflix subscription',
        available: true,
        stock: 25
      },
      {
        id: 4,
        title: 'Spotify Premium',
        image: 'https://images.pexels.com/photos/3971985/pexels-photo-3971985.jpeg',
        coins: 1500,
        discount: 0,
        popular: false,
        category: 'subscriptions',
        description: '1 month Spotify Premium subscription',
        available: true,
        stock: 75
      },
      {
        id: 5,
        title: '$25 Steam Gift Card',
        image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
        coins: 5000,
        discount: 20,
        popular: true,
        category: 'gaming',
        description: 'Redeem for $25 Steam gift card',
        available: true,
        stock: 30
      },
      {
        id: 6,
        title: 'Mystery Box',
        image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        coins: 500,
        discount: 0,
        popular: false,
        category: 'mystery',
        description: 'Random reward worth 100-1000 coins',
        available: true,
        stock: 999
      },
      {
        id: 7,
        title: 'XP Boost (2x)',
        image: 'https://images.pexels.com/photos/276452/pexels-photo-276452.jpeg',
        coins: 300,
        discount: 0,
        popular: false,
        category: 'boosts',
        description: '2x XP for 24 hours',
        available: true,
        stock: 999
      },
      {
        id: 8,
        title: 'Coin Multiplier (1.5x)',
        image: 'https://images.pexels.com/photos/207924/pexels-photo-207924.jpeg',
        coins: 400,
        discount: 0,
        popular: false,
        category: 'boosts',
        description: '1.5x coins for 12 hours',
        available: true,
        stock: 999
      }
    ];

    res.json({ shopItems });
  } catch (error) {
    console.error('Get shop items error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Purchase an item
router.post("/purchase", authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.body;
    
    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    // Get item details
    const shopItems = {
      1: { title: '$10 Amazon Gift Card', coins: 2000, type: 'gift-card', value: 10 },
      2: { title: '$5 Starbucks Card', coins: 1000, type: 'gift-card', value: 5 },
      3: { title: 'Netflix 1 Month', coins: 2500, type: 'subscription', value: 'netflix' },
      4: { title: 'Spotify Premium', coins: 1500, type: 'subscription', value: 'spotify' },
      5: { title: '$25 Steam Gift Card', coins: 5000, type: 'gift-card', value: 25 },
      6: { title: 'Mystery Box', coins: 500, type: 'mystery', value: 'random' },
      7: { title: 'XP Boost (2x)', coins: 300, type: 'boost', value: 'xp-2x' },
      8: { title: 'Coin Multiplier (1.5x)', coins: 400, type: 'boost', value: 'coin-1.5x' }
    };

    const item = shopItems[itemId];
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
    const user = await User.findById(req.user._id);
    
    // Deduct coins
    user.coins -= item.coins;
    
    // Handle different item types
    let reward = null;
    switch (item.type) {
      case 'mystery':
        // Random reward between 100-1000 coins
        const mysteryReward = Math.floor(Math.random() * 901) + 100;
        user.coins += mysteryReward;
        reward = { type: 'coins', amount: mysteryReward };
        break;
      case 'boost':
        // In a real app, you'd store boost timers
        reward = { type: 'boost', effect: item.value };
        break;
      case 'gift-card':
      case 'subscription':
        // In a real app, you'd generate actual codes
        reward = { type: item.type, code: `BOLT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}` };
        break;
    }

    await user.save();

    res.json({
      message: "Purchase successful",
      item: {
        id: itemId,
        title: item.title,
        coinsSpent: item.coins
      },
      reward,
      newBalance: user.coins
    });

  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get shop categories
router.get("/categories", async (req, res) => {
  try {
    const categories = [
      { id: 'all', name: 'All Items', count: 8 },
      { id: 'gift-cards', name: 'Gift Cards', count: 3 },
      { id: 'subscriptions', name: 'Subscriptions', count: 2 },
      { id: 'gaming', name: 'Gaming', count: 1 },
      { id: 'mystery', name: 'Mystery Items', count: 1 },
      { id: 'boosts', name: 'Boosts', count: 2 }
    ];

    res.json({ categories });
  } catch (error) {
    console.error('Get shop categories error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's purchase history
router.get("/history", authenticateToken, async (req, res) => {
  try {
    // In a real app, you'd have a separate Purchase model
    // For now, we'll return a mock history
    const purchaseHistory = [
      {
        id: 1,
        itemTitle: 'Mystery Box',
        coinsSpent: 500,
        reward: { type: 'coins', amount: 750 },
        date: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        id: 2,
        itemTitle: '$5 Starbucks Card',
        coinsSpent: 1000,
        reward: { type: 'gift-card', code: 'BOLT-123456789' },
        date: new Date(Date.now() - 172800000) // 2 days ago
      }
    ];

    res.json({ purchaseHistory });
  } catch (error) {
    console.error('Get purchase history error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get popular items
router.get("/popular", async (req, res) => {
  try {
    const popularItems = [
      {
        id: 1,
        title: '$10 Amazon Gift Card',
        image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
        coins: 2000,
        discount: 10,
        sales: 150
      },
      {
        id: 3,
        title: 'Netflix 1 Month',
        image: 'https://images.pexels.com/photos/1353368/pexels-photo-1353368.jpeg',
        coins: 2500,
        discount: 15,
        sales: 89
      },
      {
        id: 5,
        title: '$25 Steam Gift Card',
        image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
        coins: 5000,
        discount: 20,
        sales: 67
      }
    ];

    res.json({ popularItems });
  } catch (error) {
    console.error('Get popular items error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
