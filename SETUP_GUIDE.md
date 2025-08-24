# 🚀 Bolt Application Setup Guide

This guide will help you set up the complete Bolt gamified web application with both frontend and backend.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Recommended - Cloud)

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (free tier is sufficient)

2. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

3. **Update Environment Variables**:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bolt-app
   ```

### Option 2: Local MongoDB Installation

#### Windows:
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. MongoDB will run as a service automatically

#### macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### Linux (Ubuntu):
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## 🔧 Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/bolt-app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=http://localhost:5174
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   ✅ Connected to MongoDB
   🚀 Bolt server running on port 5000
   📱 Frontend URL: http://localhost:5174
   ```

## 🎨 Frontend Setup

1. **Navigate to project root**:
   ```bash
   cd ..
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Start the frontend**:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v5.4.19  ready in 840 ms
   ➜  Local:   http://localhost:5174/
   ```

## 🧪 Testing the Application

### 1. Test Backend Health
```bash
curl http://localhost:5000/health
```
Expected response:
```json
{
  "status": "OK",
  "message": "Bolt server is running!"
}
```

### 2. Test API Endpoints
Run the test script:
```bash
node test-backend.js
```

### 3. Test Frontend
- Open http://localhost:5174 in your browser
- Try signing up with a new account
- Test login functionality
- Check if dashboard data loads correctly

## 🔍 Troubleshooting

### Backend Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Port Already in Use**:
   - Change PORT in `.env` file
   - Kill process using the port: `npx kill-port 5000`

3. **JWT Secret Error**:
   - Ensure JWT_SECRET is set in `.env`
   - Use a strong, unique secret

### Frontend Issues

1. **API Connection Error**:
   - Ensure backend is running on port 5000
   - Check CORS configuration
   - Verify API endpoints

2. **Build Errors**:
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for missing dependencies

## 📊 Verification Checklist

- [ ] MongoDB is running and accessible
- [ ] Backend server starts without errors
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] JWT tokens are generated and validated
- [ ] Dashboard displays user data
- [ ] Games, tasks, and shop data loads
- [ ] Coins and XP system works
- [ ] Leaderboard displays correctly

## 🚀 Production Deployment

For production deployment:

1. **Environment Variables**:
   ```env
   NODE_ENV=production
   MONGO_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-secret
   FRONTEND_URL=your-frontend-url
   ```

2. **Security**:
   - Use strong JWT secrets
   - Enable HTTPS
   - Set up proper CORS
   - Use environment-specific MongoDB

3. **Performance**:
   - Enable MongoDB indexes
   - Use connection pooling
   - Implement caching
   - Set up monitoring

## 📞 Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure all environment variables are set
4. Test each component individually

## 🎉 Success!

Once everything is working, you should have:

- ✅ **Backend API** running on port 5000
- ✅ **Frontend** running on port 5174
- ✅ **MongoDB** connected and storing data
- ✅ **Authentication** working with JWT tokens
- ✅ **Gamification** features functional
- ✅ **Dashboard** displaying real-time data

Your Bolt application is now ready to use! 🚀
