import express from 'express';
import {
  getDailyQuestion,
  getRawDailyQuestion,
  getQuestionDetail,
  getProblems
} from '../controllers/problemController.js';

const router = express.Router();

// Daily question routes
router.get('/daily', getDailyQuestion);
router.get('/dailyQuestion', getRawDailyQuestion);

// Question detail route
router.get('/select', getQuestionDetail);

// Problems list routes
router.get('/problems', getProblems);

export default router;
