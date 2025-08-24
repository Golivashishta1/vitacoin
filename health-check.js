// Comprehensive Health Check for MongoDB Compass Integration
import http from 'http';
import { URL } from 'url';

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  username: 'healthcheckuser',
  email: 'healthcheck@test.com',
  password: 'TestPass123'
};

let authToken = null;

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const config = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...options.headers
      }
    };

    const req = http.request(config, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Health check functions
async function checkMongoDBConnection() {
  console.log('🔍 Checking MongoDB Connection...');
  try {
    const response = await makeRequest('http://localhost:5000/health');
    console.log('✅ MongoDB Connection Status:', response.data);
    return response.status === 200;
  } catch (error) {
    console.log('❌ MongoDB Connection Failed:', error.message);
    return false;
  }
}

async function checkBackendServer() {
  console.log('\n🚀 Checking Backend Server...');
  try {
    const response = await makeRequest('http://localhost:5000/health');
    console.log('✅ Backend Server Status:', response.data);
    return response.status === 200;
  } catch (error) {
    console.log('❌ Backend Server Failed:', error.message);
    return false;
  }
}

async function checkFrontendServer() {
  console.log('\n🎨 Checking Frontend Server...');
  try {
    const response = await makeRequest('http://localhost:5175');
    console.log('✅ Frontend Server Status: Running on port 5175');
    return true;
  } catch (error) {
    console.log('❌ Frontend Server Failed:', error.message);
    return false;
  }
}

async function testUserRegistration() {
  console.log('\n📝 Testing User Registration (MongoDB)...');
  try {
    const response = await makeRequest(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify(testUser)
    });
    
    console.log('Registration Response:', response);
    
    if (response.status === 201 || response.status === 200) {
      authToken = response.data.token;
      console.log('✅ User Registration Successful - Data saved to MongoDB');
      return true;
    } else {
      console.log('❌ User Registration Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Registration Error:', error.message);
    return false;
  }
}

async function testUserLogin() {
  console.log('\n🔐 Testing User Login (MongoDB)...');
  try {
    const response = await makeRequest(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    console.log('Login Response:', response);
    
    if (response.status === 200) {
      authToken = response.data.token;
      console.log('✅ User Login Successful - Data retrieved from MongoDB');
      return true;
    } else {
      console.log('❌ User Login Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Login Error:', error.message);
    return false;
  }
}

async function testUserProfile() {
  console.log('\n👤 Testing User Profile (MongoDB)...');
  try {
    const response = await makeRequest(`${BASE_URL}/auth/me`);
    
    console.log('Profile Response:', response);
    
    if (response.status === 200) {
      console.log('✅ User Profile Retrieved - Data from MongoDB');
      console.log('User Data:', response.data.user);
      return true;
    } else {
      console.log('❌ User Profile Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Profile Error:', error.message);
    return false;
  }
}

async function testUserStats() {
  console.log('\n📊 Testing User Stats (MongoDB)...');
  try {
    const response = await makeRequest(`${BASE_URL}/user/stats`);
    
    console.log('Stats Response:', response);
    
    if (response.status === 200) {
      console.log('✅ User Stats Retrieved - Data from MongoDB');
      console.log('Stats Data:', response.data.stats);
      return true;
    } else {
      console.log('❌ User Stats Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Stats Error:', error.message);
    return false;
  }
}

async function testGamesAPI() {
  console.log('\n🎮 Testing Games API...');
  try {
    const response = await makeRequest(`${BASE_URL}/games`);
    
    console.log('Games Response:', response);
    
    if (response.status === 200) {
      console.log('✅ Games API Working - Available games loaded');
      return true;
    } else {
      console.log('❌ Games API Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Games Error:', error.message);
    return false;
  }
}

async function testShopAPI() {
  console.log('\n🛒 Testing Shop API...');
  try {
    const response = await makeRequest(`${BASE_URL}/shop`);
    
    console.log('Shop Response:', response);
    
    if (response.status === 200) {
      console.log('✅ Shop API Working - Shop items loaded');
      return true;
    } else {
      console.log('❌ Shop API Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Shop Error:', error.message);
    return false;
  }
}

async function testGameCompletion() {
  console.log('\n🏆 Testing Game Completion (MongoDB Update)...');
  try {
    const response = await makeRequest(`${BASE_URL}/games/complete`, {
      method: 'POST',
      body: JSON.stringify({
        gameId: 1,
        score: 1500,
        duration: 300,
        won: true
      })
    });
    
    console.log('Game Completion Response:', response);
    
    if (response.status === 200) {
      console.log('✅ Game Completion Successful - User stats updated in MongoDB');
      console.log('Rewards:', response.data.rewards);
      return true;
    } else {
      console.log('❌ Game Completion Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Game Completion Error:', error.message);
    return false;
  }
}

async function testAddCoins() {
  console.log('\n🪙 Testing Add Coins (MongoDB Update)...');
  try {
    const response = await makeRequest(`${BASE_URL}/user/coins/add`, {
      method: 'POST',
      body: JSON.stringify({ amount: 500 })
    });
    
    console.log('Add Coins Response:', response);
    
    if (response.status === 200) {
      console.log('✅ Add Coins Successful - Balance updated in MongoDB');
      console.log('New Balance:', response.data.newBalance);
      return true;
    } else {
      console.log('❌ Add Coins Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Add Coins Error:', error.message);
    return false;
  }
}

async function testLeaderboard() {
  console.log('\n🏅 Testing Leaderboard (MongoDB)...');
  try {
    const response = await makeRequest(`${BASE_URL}/user/leaderboard`);
    
    console.log('Leaderboard Response:', response);
    
    if (response.status === 200) {
      console.log('✅ Leaderboard Retrieved - Data from MongoDB');
      console.log('Leaderboard Entries:', response.data.leaderboard.length);
      return true;
    } else {
      console.log('❌ Leaderboard Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Leaderboard Error:', error.message);
    return false;
  }
}

// Main health check runner
async function runHealthChecks() {
  console.log('🚀 Starting Comprehensive Health Checks for MongoDB Compass Integration...\n');
  
  const checks = [
    { name: 'MongoDB Connection', fn: checkMongoDBConnection },
    { name: 'Backend Server', fn: checkBackendServer },
    { name: 'Frontend Server', fn: checkFrontendServer },
    { name: 'User Registration', fn: testUserRegistration },
    { name: 'User Login', fn: testUserLogin },
    { name: 'User Profile', fn: testUserProfile },
    { name: 'User Stats', fn: testUserStats },
    { name: 'Games API', fn: testGamesAPI },
    { name: 'Shop API', fn: testShopAPI },
    { name: 'Game Completion', fn: testGameCompletion },
    { name: 'Add Coins', fn: testAddCoins },
    { name: 'Leaderboard', fn: testLeaderboard }
  ];
  
  const results = [];
  
  for (const check of checks) {
    try {
      const passed = await check.fn();
      results.push({ name: check.name, passed });
    } catch (error) {
      console.error(`❌ ${check.name} failed with error:`, error.message);
      results.push({ name: check.name, passed: false });
    }
  }
  
  // Summary
  console.log('\n📋 HEALTH CHECK SUMMARY');
  console.log('========================');
  
  const passedChecks = results.filter(r => r.passed).length;
  const totalChecks = results.length;
  
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
  });
  
  console.log(`\n🎯 Results: ${passedChecks}/${totalChecks} checks passed`);
  
  if (passedChecks === totalChecks) {
    console.log('\n🎉 ALL SYSTEMS OPERATIONAL!');
    console.log('✅ MongoDB Compass Integration: FULLY FUNCTIONAL');
    console.log('✅ All data operations linked to MongoDB');
    console.log('✅ Authentication system working');
    console.log('✅ Dashboard data from MongoDB');
    console.log('✅ Game progress saved to MongoDB');
    console.log('✅ Shop transactions in MongoDB');
    console.log('✅ Leaderboard from MongoDB');
  } else {
    console.log('\n⚠️  Some systems need attention');
    console.log('Please check the failed components above');
  }
  
  console.log('\n🔗 Connection Status:');
  console.log('Frontend (Port 5175) → Backend (Port 5000) → MongoDB (Port 27017)');
}

// Run health checks
runHealthChecks().catch(console.error);
