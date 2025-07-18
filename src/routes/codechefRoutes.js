import express from 'express';
import {
  getCodeChefUserProfile,
  getCodeChefUserRating,
  getCodeChefUserRanking,
  getCodeChefUserStats,
  getCodeChefContests
} from '../controllers/codechefController.js';

const router = express.Router();

// CodeChef user endpoints
router.get('/codechef/user/:username', getCodeChefUserProfile);
router.get('/codechef/user/:username/rating', getCodeChefUserRating);
router.get('/codechef/user/:username/ranking', getCodeChefUserRanking);
router.get('/codechef/user/:username/stats', getCodeChefUserStats);

// CodeChef contest endpoints
router.get('/codechef/contests', getCodeChefContests);

export default router;
