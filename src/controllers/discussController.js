import client from '../utils/client.js';
import { GRAPHQL_QUERIES } from '../config/constants.js';
import { handleError, handleResponse, validateLimit } from '../utils/helpers.js';

export const getTrendingDiscussions = async (req, res) => {
  try {
    const first = validateLimit(req.query.first, 20, 50);
    
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.TRENDING_DISCUSS, { first });
    
    if (!data.cachedTrendingCategoryTopics) {
      return handleError(res, new Error('Trending discussions not found'), 404);
    }
    
    handleResponse(res, data.cachedTrendingCategoryTopics, 'Trending discussions retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getDiscussionTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    
    if (!topicId || isNaN(parseInt(topicId))) {
      return handleError(res, new Error('Valid topicId parameter is required'), 400);
    }
    
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.DISCUSS_TOPIC, { 
      topicId: parseInt(topicId) 
    });
    
    if (!data.topic) {
      return handleError(res, new Error('Discussion topic not found'), 404);
    }
    
    handleResponse(res, data.topic, 'Discussion topic retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getDiscussionComments = async (req, res) => {
  try {
    const { topicId } = req.params;
    
    if (!topicId || isNaN(parseInt(topicId))) {
      return handleError(res, new Error('Valid topicId parameter is required'), 400);
    }
    
    // For now, return the topic data as comments require additional GraphQL queries
    // that would need to be implemented based on LeetCode's current API structure
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.DISCUSS_TOPIC, { 
      topicId: parseInt(topicId) 
    });
    
    if (!data.topic) {
      return handleError(res, new Error('Discussion topic not found'), 404);
    }
    
    // Return basic topic info - full comment system would require additional queries
    const result = {
      topicId: data.topic.id,
      title: data.topic.title,
      commentCount: data.topic.topLevelCommentCount,
      message: 'Full comment listing requires additional implementation'
    };
    
    handleResponse(res, result, 'Discussion comments info retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};
