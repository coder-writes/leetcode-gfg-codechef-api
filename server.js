import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

// Import routes
import userRoutes from './src/routes/userRoutes.js';
import problemRoutes from './src/routes/problemRoutes.js';
import discussRoutes from './src/routes/discussRoutes.js';
import codechefRoutes from './src/routes/codechefRoutes.js';
import geeksforgeeksRoutes from './src/routes/geeksforgeeksRoutes.js';

// Import middleware
import errorHandler from './src/middleware/errorHandler.js';
import createRateLimiter from './src/middleware/rateLimiter.js';

const app = express();
const PORT = process.env.PORT || 3000;
const domain = process.env.YOUR_DOMAIN || 'https://risshi.me';
// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// CORS configuration
app.use(cors({
    origin: '*',
    credentials: false
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(createRateLimiter(15 * 600 * 1000, 10000)); // 1000 requests per 15 minutes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'LeetCode, CodeChef & GeeksforGeeks API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API documentation endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to LeetCode, CodeChef & GeeksforGeeks API',
    documentation: {
      leetcodeEndpoints: {
        profile: '/leetcode/:username - Get LeetCode user profile details',
        badges: '/leetcode/:username/badges - Get LeetCode user badges',
        solved: '/leetcode/:username/solved - Get LeetCode solved problems count',
        contest: '/leetcode/:username/contest - Get LeetCode contest participation details',
        contestHistory: '/leetcode/:username/contest/history - Get LeetCode contest history most recent contest first (returns all contests) ',
        contestHistoryAttended: '/leetcode/:username/contest/history?attendedOnly=true - Get LeetCode attended contests history',
        submissions: '/leetcode/:username/submission - Get LeetCode recent submissions',
        acceptedSubmissions: '/leetcode/:username/acSubmission - Get LeetCode accepted submissions',
        calendar: '/leetcode/:username/calendar - Get LeetCode submission calendar',
        fullProfile: '/leetcode/userProfile/:username - Get LeetCode full profile in one call',
        completeData: '/leetcode/user/:username/complete - Get ALL LeetCode data in one comprehensive call',
        languageStats: '/leetcode/languageStats?username=name - Get LeetCode language statistics',
        skillStats: '/leetcode/skillStats/:username - Get LeetCode skill statistics',
        questionProgress: '/leetcode/userProfileUserQuestionProgressV2/:userSlug - Get LeetCode question progress',
        contestRanking: '/leetcode/userContestRankingInfo/:username - Get LeetCode contest ranking'
      },
      codechefEndpoints: {
        profile: '/codechef/user/:username - Get CodeChef user profile details',
        rating: '/codechef/user/:username/rating - Get CodeChef user rating (returns 0 if no contests)',
        ranking: '/codechef/user/:username/ranking - Get CodeChef user ranking',
        stats: '/codechef/user/:username/stats - Get CodeChef user complete statistics',
        contests: '/codechef/contests - Get CodeChef contest list'
      },
      geeksforgeeksEndpoints: {
        profile: '/geeksforgeeks/user/:username - Get GeeksforGeeks user profile details',
        stats: '/geeksforgeeks/user/:username/stats - Get GeeksforGeeks user statistics',
        solved: '/geeksforgeeks/user/:username/solved - Get GeeksforGeeks solved problems count',
        practice: '/geeksforgeeks/user/:username/practice - Get GeeksforGeeks practice problems',
        contests: '/geeksforgeeks/user/:username/contests - Get GeeksforGeeks contest history',
        school: '/geeksforgeeks/user/:username/school - Get GeeksforGeeks school progress',
        completeData: '/geeksforgeeks/user/:username/complete - Get ALL GeeksforGeeks data in one comprehensive call',
        problemOfTheDay: '/geeksforgeeks/problem-of-the-day - Get GeeksforGeeks problem of the day'
      },
      problemEndpoints: {
        daily: '/leetcode/daily - Get LeetCode daily challenge question',
        rawDaily: '/leetcode/dailyQuestion - Get LeetCode raw daily question data',
        select: '/leetcode/select?titleSlug=question-slug - Get LeetCode specific question details',
        problems: '/leetcode/problems - Get LeetCode problems list (supports limit, skip, tags, difficulty)'
      },
      discussionEndpoints: {
        trending: '/leetcode/trendingDiscuss?first=20 - Get LeetCode trending discussions',
        topic: '/leetcode/discussTopic/:topicId - Get LeetCode discussion topic',
        comments: '/leetcode/discussComments/:topicId - Get LeetCode discussion comments'
      }
    },
    examples: {
      leetcodeProfile: '/leetcode/leetcode_username',
      leetcodeBadges: '/leetcode/leetcode_username/badges',
      leetcodeCompleteData: '/leetcode/user/leetcode_username/complete',
      leetcodeDailyQuestion: '/leetcode/daily',
      leetcodeProblems: '/leetcode/problems?limit=10&tags=array+string&difficulty=EASY',
      leetcodeTrending: '/leetcode/trendingDiscuss?first=10',
      codechefProfile: '/codechef/user/codechef_username',
      codechefRating: '/codechef/user/codechef_username/rating',
      codechefRanking: '/codechef/user/codechef_username/ranking',
      codechefStats: '/codechef/user/codechef_username/stats',
      codechefContests: '/codechef/contests',
      geeksforgeeksProfile: '/geeksforgeeks/user/gfg_username',
      geeksforgeeksStats: '/geeksforgeeks/user/gfg_username/stats',
      geeksforgeeksCompleteData: '/geeksforgeeks/user/gfg_username/complete',
      geeksforgeeksProblemOfTheDay: '/geeksforgeeks/problem-of-the-day'
    },
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/leetcode', problemRoutes);
app.use('/leetcode', discussRoutes);
app.use('/leetcode', userRoutes);
app.use('/', codechefRoutes);
app.use('/', geeksforgeeksRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);
const port = PORT;
app.listen(port, () => {
  console.log(`🚀 LeetCode, CodeChef & GeeksforGeeks API Server is running on port ${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/`);
  console.log(`🔍 Health Check: http://localhost:${port}/health`);
  console.log(`🎯 Environment: ${process.env.NODE_ENV || 'development'}`);
});
// Start server
// const startServer = (port) => {

//   server.on('error', (err) => {
//     if (err.code === 'EADDRINUSE') {
//       console.log(`Port ${port} is busy, trying port ${port + 1}...`);
//       startServer(port + 1);
//     } else {
//       console.error('Server error:', err);
//     }
//   });

//   return server;
// };

// startServer(PORT);

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM received, shutting down gracefully');
//   process.exit(0);
// });

// process.on('SIGINT', () => {
//   console.log('SIGINT received, shutting down gracefully');
//   process.exit(0);
// });

export default app;
