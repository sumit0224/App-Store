#!/usr/bin/env node

/**
 * Simple API Test Script for App Store
 * Run with: node test-api.js
 */

const baseUrl = 'http://localhost:5000/api';

async function testEndpoint(method, endpoint, data = null, token = null) {
  const url = `${baseUrl}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    console.log(`✅ ${method} ${endpoint} - Status: ${response.status}`);
    if (response.status >= 400) {
      console.log(`   Error: ${result.error || 'Unknown error'}`);
    }
    return result;
  } catch (error) {
    console.log(`❌ ${method} ${endpoint} - Error: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Starting API Tests...\n');

  // Test 1: Health Check
  console.log('1. Testing Health Check');
  await testEndpoint('GET', '/');
  console.log('');

  // Test 2: Sign Up
  console.log('2. Testing User Sign Up');
  const signupData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  };
  const signupResult = await testEndpoint('POST', '/auth/signup', signupData);
  console.log('');

  // Test 3: Login
  console.log('3. Testing User Login');
  const loginData = {
    email: 'test@example.com',
    password: 'password123'
  };
  const loginResult = await testEndpoint('POST', '/auth/login', loginData);
  const token = loginResult?.token;
  console.log('');

  if (!token) {
    console.log('❌ No token received, skipping authenticated tests');
    return;
  }

  // Test 4: Get Apps
  console.log('4. Testing Get Apps');
  await testEndpoint('GET', '/apps');
  console.log('');

  // Test 5: Search Apps
  console.log('5. Testing Search Apps');
  await testEndpoint('GET', '/apps/search?q=test');
  console.log('');

  // Test 6: Create App (Developer)
  console.log('6. Testing Create App (requires developer role)');
  const appData = {
    title: 'Test App',
    slug: 'test-app',
    shortDescription: 'A test application',
    description: 'This is a test application for demonstration purposes',
    categories: [],
    price: 0,
    currency: 'INR'
  };
  const appResult = await testEndpoint('POST', '/dev/apps', appData, token);
  console.log('');

  // Test 7: Get Upload URL (if app was created)
  if (appResult?.app?._id) {
    console.log('7. Testing Get Upload URL');
    const uploadData = {
      filename: 'test-app.apk',
      contentType: 'application/vnd.android.package-archive'
    };
    await testEndpoint('POST', `/dev/apps/${appResult.app._id}/upload-url`, uploadData, token);
    console.log('');
  }

  console.log('🎉 API Tests Completed!');
  console.log('\n📝 Notes:');
  console.log('- Some tests may fail if MongoDB is not running');
  console.log('- Developer role tests require proper user role setup');
  console.log('- AWS S3 tests require proper credentials');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ or a fetch polyfill');
  console.log('   Install node-fetch: npm install node-fetch');
  process.exit(1);
}

runTests().catch(console.error);
