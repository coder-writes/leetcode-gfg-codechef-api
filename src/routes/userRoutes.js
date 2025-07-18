import express from 'express';
import {
  getUserProfile,
  getUserBadges,
  getUserSolved,
  getUserContest,
  getUserContestHistory,
  getUserSubmissions,
  getUserAcceptedSubmissions,
  getUserCalendar,
  getFullUserProfile,
  getUserLanguageStats,
  getUserSkillStats,
  getUserQuestionProgress,
  getUserContestRanking,
  getAllUserData
} from '../controllers/userController.js';

const router = express.Router();

// User profile routes
router.get('/:username', getUserProfile);
router.get('/:username/badges', getUserBadges);
router.get('/:username/solved', getUserSolved);
router.get('/:username/contest', getUserContest);
router.get('/:username/contest/history', getUserContestHistory);
router.get('/:username/submission', getUserSubmissions);
router.get('/:username/acSubmission', getUserAcceptedSubmissions);
router.get('/:username/calendar', getUserCalendar);

// New endpoints
router.get('/userProfile/:username', getFullUserProfile);
router.get('/userProfileCalendar', getUserCalendar); // Alternative route for calendar with query params
router.get('/languageStats', getUserLanguageStats);
router.get('/userProfileUserQuestionProgressV2/:userSlug', getUserQuestionProgress);
router.get('/skillStats/:username', getUserSkillStats);
router.get('/userContestRankingInfo/:username', getUserContestRanking);

// Complete user data endpoint - fetches everything at once
router.get('/user/:username/complete', getAllUserData);

export default router;
