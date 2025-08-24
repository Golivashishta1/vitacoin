// Test script to verify MongoDB connection and API endpoints
const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'TestPass123'
};

let authToken = null;

// Helper function to make API calls
async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    return { status: 500, data: { error: error.message } };
  }
}

// Test functions
async function testHealthCheck() {
  console.log('🔍 Testing health check...');
  try {
    const response = await fetch('http://localhost:5000/health');
    const data = await response.json();
    console.log('Health check response:', data);
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
}

async function testSignup() {
  console.log('\n📝 Testing user signup...');
  const response = await makeRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
  
  console.log('Signup response:', response);
  
  if (response.status === 201 || response.status === 200) {
    authToken = response.data.token;
    console.log('✅ Signup successful, token received');
    return true;
  } else {
    console.log('❌ Signup failed');
    return false;
  }
}

async function testLogin() {
  console.log('\n🔐 Testing user login...');
  const response = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password
    })
  });
  
  console.log('Login response:', response);
  
  if (response.status === 200) {
    authToken = response.data.token;
    console.log('✅ Login successful, token received');
    return true;
  } else {
    console.log('❌ Login failed');
    return false;
  }
}

async function testGetUserProfile() {
  console.log('\n👤 Testing get user profile...');
  const response = await makeRequest('/auth/me');
  
  console.log('Profile response:', response);
  
  if (response.status === 200) {
    console.log('✅ Profile retrieved successfully');
    console.log('User data:', response.data.user);
    return true;
  } else {
    console.log('❌ Profile retrieval failed');
    return false;
  }
}

async function testGetUserStats() {
  console.log('\n📊 Testing get user stats...');
  const response = await makeRequest('/user/stats');
  
  console.log('Stats response:', response);
  
  if (response.status === 200) {
    console.log('✅ Stats retrieved successfully');
    console.log('User stats:', response.data.stats);
    return true;
  } else {
    console.log('❌ Stats retrieval failed');
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting MongoDB API tests...\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'User Signup', fn: testSignup },
    { name: 'User Login', fn: testLogin },
    { name: 'Get User Profile', fn: testGetUserProfile },
    { name: 'Get User Stats', fn: testGetUserStats }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const passed = await test.fn();
      results.push({ name: test.name, passed });
    } catch (error) {
      console.error(`❌ ${test.name} failed with error:`, error.message);
      results.push({ name: test.name, passed: false });
    }
  }
  
  // Summary
  console.log('\n📋 Test Summary:');
  console.log('================');
  
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
  });
  
  console.log(`\n🎯 Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! MongoDB and API are working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the configuration.');
  }
}

// Run tests
runAllTests().catch(console.error);
