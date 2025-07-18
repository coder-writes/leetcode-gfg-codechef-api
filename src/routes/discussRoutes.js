import express from 'express';
import {
  getTrendingDiscussions,
  getDiscussionTopic,
  getDiscussionComments
} from '../controllers/discussController.js';

const router = express.Router();

// Discussion routes
router.get('/trendingDiscuss', getTrendingDiscussions);
router.get('/discussTopic/:topicId', getDiscussionTopic);
router.get('/discussComments/:topicId', getDiscussionComments);

export default router;
