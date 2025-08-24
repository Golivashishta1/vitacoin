#!/bin/bash

echo "🚀 Starting MongoDB API Server and Tests..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start server in background
echo "🔧 Starting server..."
node server/server.js &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Run tests
echo "🧪 Running MongoDB tests..."
node test-mongodb.js

# Clean up - kill server
echo "🧹 Stopping server..."
kill $SERVER_PID 2>/dev/null

echo "✅ Done!"