import express from 'express';
import {
  getUserProfile,
  getUserStats,
  getUserSolved,
  getUserPracticeProblems,
  getUserContestHistory,
  getUserSchoolProgress,
  getAllUserData,
  getProblemOfTheDay
} from '../controllers/geeksforgeeksController.js';

const router = express.Router();

// GeeksforGeeks user routes
router.get('/geeksforgeeks/user/:username', getUserProfile);
router.get('/geeksforgeeks/user/:username/stats', getUserStats);
router.get('/geeksforgeeks/user/:username/solved', getUserSolved);
router.get('/geeksforgeeks/user/:username/practice', getUserPracticeProblems);
router.get('/geeksforgeeks/user/:username/contests', getUserContestHistory);
router.get('/geeksforgeeks/user/:username/school', getUserSchoolProgress);
router.get('/geeksforgeeks/user/:username/complete', getAllUserData);

// GeeksforGeeks problem routes
router.get('/geeksforgeeks/problem-of-the-day', getProblemOfTheDay);

export default router;
