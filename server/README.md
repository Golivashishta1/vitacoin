# Bolt Backend Server

A comprehensive backend server for the Bolt gamified web application, built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with secure password hashing
- 🎮 **Game Management**: Track game sessions, scores, and rewards
- 📋 **Task System**: Daily and weekly tasks with progress tracking
- 🛒 **Shop System**: Virtual currency shop with real-world rewards
- 👥 **User Management**: Comprehensive user profiles and statistics
- 📊 **Leaderboards**: Global and category-based rankings
- 🔒 **Security**: Rate limiting, input validation, and security headers

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, express-rate-limit
- **Validation**: express-validator

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/bolt-app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=http://localhost:5174
   ```

3. **Start the server**:
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /signup` - Register a new user
- `POST /login` - User login
- `GET /me` - Get current user profile
- `POST /refresh` - Refresh JWT token
- `POST /logout` - User logout

### User Management (`/api/user`)

- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /stats` - Get user statistics
- `GET /leaderboard` - Get global leaderboard
- `POST /coins/add` - Add coins to user
- `POST /xp/add` - Add XP to user

### Games (`/api/games`)

- `GET /` - Get available games
- `POST /start` - Start a game session
- `POST /complete` - Complete a game and get rewards
- `GET /stats` - Get user's game statistics
- `GET /categories` - Get game categories

### Tasks (`/api/tasks`)

- `GET /` - Get available tasks
- `POST /complete` - Complete a task and get rewards
- `GET /categories` - Get task categories
- `GET /stats` - Get user's task statistics

### Shop (`/api/shop`)

- `GET /` - Get available shop items
- `POST /purchase` - Purchase an item
- `GET /categories` - Get shop categories
- `GET /history` - Get user's purchase history
- `GET /popular` - Get popular items

## Database Schema

### User Model

```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  avatarUrl: String,
  
  // Game Stats
  level: Number (default: 1),
  xp: Number (default: 0),
  coins: Number (default: 1000),
  lifetimeCoins: Number (default: 1000),
  
  // Streaks & Progress
  currentStreak: Number (default: 0),
  longestStreak: Number (default: 0),
  lastLoginDate: Date,
  
  // Game Statistics
  gamesPlayed: Number (default: 0),
  gamesWon: Number (default: 0),
  totalPlayTime: Number (default: 0),
  
  // Tasks & Achievements
  tasksCompleted: Number (default: 0),
  dailyTasksCompleted: Number (default: 0),
  weeklyTasksCompleted: Number (default: 0),
  
  // Social Features
  friends: [ObjectId],
  friendRequests: [ObjectId],
  
  // Settings
  notifications: Boolean (default: true),
  theme: String (default: 'dark'),
  
  // Security
  isVerified: Boolean (default: false),
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

## Security Features

- **Password Hashing**: bcryptjs with 12 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: express-validator for request validation
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configured for frontend origin
- **Error Handling**: Comprehensive error handling and logging

## Development

### Project Structure

```
server/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── README.md         # This file
└── middleware/
    └── auth.js       # Authentication middleware

routes/
├── auth.js           # Authentication routes
├── user.js           # User management routes
├── games.js          # Game-related routes
├── tasks.js          # Task management routes
└── shop.js           # Shop and purchase routes

models/
└── User.js           # User data model
```

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `MONGO_URI` | MongoDB connection string | mongodb://localhost:27017/bolt-app |
| `JWT_SECRET` | JWT signing secret | your-secret-key |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5174 |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
