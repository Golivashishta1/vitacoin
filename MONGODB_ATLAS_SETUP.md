# 🗄️ MongoDB Atlas Quick Setup

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" or "Sign Up"
3. Fill in your details and create account

## Step 2: Create a Cluster

1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to you
5. Click "Create"

## Step 3: Set Up Database Access

1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

## Step 4: Set Up Network Access

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

## Step 5: Get Connection String

1. Go back to "Database" in the sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string

## Step 6: Update Your Environment

1. In your `server` directory, create a `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/bolt-app?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:5174
```

2. Replace:
   - `yourusername` with your database username
   - `yourpassword` with your database password
   - `cluster.mongodb.net` with your actual cluster URL

## Step 7: Test Connection

1. Start your backend server:
```bash
cd server
npm run dev
```

2. You should see:
```
✅ Connected to MongoDB
🚀 Bolt server running on port 5000
```

## 🎉 Done!

Your MongoDB Atlas database is now connected to your Bolt application!

## 🔒 Security Notes

- For production, don't use "Allow Access from Anywhere"
- Use strong passwords
- Enable MongoDB Atlas security features
- Set up proper IP whitelisting
