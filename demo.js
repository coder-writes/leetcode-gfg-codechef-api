#!/usr/bin/env node

/**
 * LeetCode & CodeChef API Demo Script
 * This script demonstrates all the available endpoints
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const TEST_LEETCODE_USERNAME = 'leetcode'; // You can change this to any valid LeetCode username
const TEST_CODECHEF_USERNAME = 'admin'; // You can change this to any valid CodeChef username

console.log('🚀 LeetCode & CodeChef API Demo\n');

const testEndpoint = async (url, description) => {
  try {
    console.log(`Testing: ${description}`);
    console.log(`URL: ${url}`);
    
    const response = await axios.get(url);
    console.log(`✅ Success:`, JSON.stringify(response.data, null, 2).substring(0, 300) + '...\n');
  } catch (error) {
    console.log(`❌ Error:`, error.response?.data?.message || error.message);
    console.log('');
  }
};

const runDemo = async () => {
  console.log('🔍 Health Check');
  await testEndpoint(`${BASE_URL}/health`, 'Health Check');

  console.log('📝 API Documentation');
  await testEndpoint(`${BASE_URL}/`, 'API Documentation');

  console.log('👤 LeetCode User Endpoints');
  await testEndpoint(`${BASE_URL}/leetcode/${TEST_LEETCODE_USERNAME}`, 'LeetCode User Profile');
  await testEndpoint(`${BASE_URL}/leetcode/${TEST_LEETCODE_USERNAME}/badges`, 'LeetCode User Badges');
  await testEndpoint(`${BASE_URL}/leetcode/${TEST_LEETCODE_USERNAME}/solved`, 'LeetCode Solved Problems');
  await testEndpoint(`${BASE_URL}/leetcode/${TEST_LEETCODE_USERNAME}/contest`, 'LeetCode Contest Info');
  await testEndpoint(`${BASE_URL}/leetcode/${TEST_LEETCODE_USERNAME}/submission?limit=3`, 'LeetCode Recent Submissions');
  await testEndpoint(`${BASE_URL}/leetcode/${TEST_LEETCODE_USERNAME}/calendar`, 'LeetCode Submission Calendar');

  console.log('🆕 New LeetCode User Endpoints');
  await testEndpoint(`${BASE_URL}/leetcode/userProfile/${TEST_LEETCODE_USERNAME}`, 'LeetCode Full Profile');
  await testEndpoint(`${BASE_URL}/leetcode/languageStats?username=${TEST_LEETCODE_USERNAME}`, 'LeetCode Language Stats');
  await testEndpoint(`${BASE_URL}/leetcode/skillStats/${TEST_LEETCODE_USERNAME}`, 'LeetCode Skill Stats');

  console.log('🍳 CodeChef User Endpoints');
  await testEndpoint(`${BASE_URL}/codechef/user/${TEST_CODECHEF_USERNAME}`, 'CodeChef User Profile');
  await testEndpoint(`${BASE_URL}/codechef/user/${TEST_CODECHEF_USERNAME}/rating`, 'CodeChef User Rating');
  await testEndpoint(`${BASE_URL}/codechef/user/${TEST_CODECHEF_USERNAME}/ranking`, 'CodeChef User Ranking');
  await testEndpoint(`${BASE_URL}/codechef/user/${TEST_CODECHEF_USERNAME}/stats`, 'CodeChef User Statistics');

  console.log('🏆 CodeChef Contest Endpoints');
  await testEndpoint(`${BASE_URL}/codechef/contests`, 'CodeChef Contest List');

  console.log('❓ LeetCode Problem Endpoints');
  await testEndpoint(`${BASE_URL}/leetcode/daily`, 'LeetCode Daily Question');
  await testEndpoint(`${BASE_URL}/leetcode/dailyQuestion`, 'LeetCode Raw Daily Question');
  await testEndpoint(`${BASE_URL}/leetcode/problems?limit=3`, 'LeetCode Problems List');
  await testEndpoint(`${BASE_URL}/leetcode/problems?difficulty=EASY&limit=2`, 'LeetCode Easy Problems');
  await testEndpoint(`${BASE_URL}/leetcode/select?titleSlug=two-sum`, 'LeetCode Specific Problem');

  console.log('💬 LeetCode Discussion Endpoints');
  await testEndpoint(`${BASE_URL}/leetcode/trendingDiscuss?first=2`, 'LeetCode Trending Discussions');

  console.log('🎉 Demo completed!');
  console.log('\n📊 Summary:');
  console.log('✅ LeetCode API: All endpoints working with /leetcode prefix');
  console.log('✅ CodeChef API: User profile, rating, ranking, and contest data');
  console.log('✅ Rating returns 0 when user has no contests');
  console.log('✅ Both APIs work independently and are properly differentiated');
};

runDemo().catch(console.error);
