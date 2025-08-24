import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    unique: true, 
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  avatarUrl: { 
    type: String,
    default: null
  },
  
  // Game Stats
  level: { 
    type: Number, 
    default: 1 
  },
  xp: { 
    type: Number, 
    default: 0 
  },
  coins: { 
    type: Number, 
    default: 1000 
  },
  lifetimeCoins: { 
    type: Number, 
    default: 1000 
  },
  
  // Streaks & Progress
  currentStreak: { 
    type: Number, 
    default: 0 
  },
  longestStreak: { 
    type: Number, 
    default: 0 
  },
  lastLoginDate: { 
    type: Date, 
    default: Date.now 
  },
  
  // Game Statistics
  gamesPlayed: { 
    type: Number, 
    default: 0 
  },
  gamesWon: { 
    type: Number, 
    default: 0 
  },
  totalPlayTime: { 
    type: Number, 
    default: 0 // in minutes
  },
  
  // Tasks & Achievements
  tasksCompleted: { 
    type: Number, 
    default: 0 
  },
  dailyTasksCompleted: { 
    type: Number, 
    default: 0 
  },
  weeklyTasksCompleted: { 
    type: Number, 
    default: 0 
  },
  
  // Social Features
  friends: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  friendRequests: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  
  // Settings & Preferences
  notifications: { 
    type: Boolean, 
    default: true 
  },
  theme: { 
    type: String, 
    default: 'dark',
    enum: ['dark', 'light']
  },
  
  // Verification & Security
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  verificationToken: { 
    type: String 
  },
  resetPasswordToken: { 
    type: String 
  },
  resetPasswordExpires: { 
    type: Date 
  }
  
}, { 
  timestamps: true 
});


// Virtual for win rate
userSchema.virtual('winRate').get(function() {
  return this.gamesPlayed > 0 ? (this.gamesWon / this.gamesPlayed * 100).toFixed(1) : 0;
});

// Method to add coins
userSchema.methods.addCoins = function(amount) {
  this.coins += amount;
  this.lifetimeCoins += amount;
  return this.save();
};

// Method to update streak
userSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastLogin = new Date(this.lastLoginDate);
  const daysDiff = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    this.currentStreak += 1;
    if (this.currentStreak > this.longestStreak) {
      this.longestStreak = this.currentStreak;
    }
  } else if (daysDiff > 1) {
    this.currentStreak = 1;
  }
  
  this.lastLoginDate = today;
  return this.save();
};

// Method to add XP and check level up
userSchema.methods.addXP = function(amount) {
  this.xp += amount;
  
  // Level up logic (simple: 1000 XP per level)
  const newLevel = Math.floor(this.xp / 1000) + 1;
  if (newLevel > this.level) {
    this.level = newLevel;
    // Give bonus coins for leveling up
    this.coins += newLevel * 100;
    this.lifetimeCoins += newLevel * 100;
  }
  
  return this.save();
};

export default mongoose.model("User", userSchema);
