import client from '../utils/client.js';
import { GRAPHQL_QUERIES } from '../config/constants.js';
import { 
  handleError, 
  handleResponse, 
  validateLimit, 
  validateSkip, 
  parseTags, 
  validateDifficulty 
} from '../utils/helpers.js';

export const getDailyQuestion = async (req, res) => {
  try {
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.DAILY_QUESTION);
    
    if (!data.activeDailyCodingChallengeQuestion) {
      return handleError(res, new Error('Daily question not found'), 404);
    }
    
    handleResponse(res, data.activeDailyCodingChallengeQuestion, 'Daily question retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getRawDailyQuestion = async (req, res) => {
  try {
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.DAILY_QUESTION);
    
    if (!data.activeDailyCodingChallengeQuestion) {
      return handleError(res, new Error('Daily question not found'), 404);
    }
    
    // Return raw data without wrapper
    res.json(data.activeDailyCodingChallengeQuestion);
  } catch (error) {
    handleError(res, error);
  }
};

export const getQuestionDetail = async (req, res) => {
  try {
    const { titleSlug } = req.query;
    
    if (!titleSlug) {
      return handleError(res, new Error('titleSlug parameter is required'), 400);
    }
    
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.QUESTION_DETAIL, { titleSlug });
    
    if (!data.question) {
      return handleError(res, new Error('Question not found'), 404);
    }
    
    handleResponse(res, data.question, 'Question details retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getProblems = async (req, res) => {
  try {
    const { tags, difficulty, limit, skip } = req.query;
    
    const parsedLimit = validateLimit(limit, 20);
    const parsedSkip = validateSkip(skip);
    const parsedTags = parseTags(tags);
    const parsedDifficulty = validateDifficulty(difficulty);
    
    // Build filters object
    const filters = {};
    
    if (parsedDifficulty) {
      filters.difficulty = parsedDifficulty;
    }
    
    if (parsedTags.length > 0) {
      filters.tags = parsedTags;
    }
    
    const variables = {
      categorySlug: "",
      limit: parsedLimit,
      skip: parsedSkip,
      filters: filters // Always include filters, even if empty
    };
    
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.PROBLEMS_LIST, variables);
    
    if (!data.problemsetQuestionList) {
      return handleError(res, new Error('Problems not found'), 404);
    }
    
    const result = {
      totalQuestions: data.problemsetQuestionList.total,
      questions: data.problemsetQuestionList.questions,
      hasMore: data.problemsetQuestionList.total > (parsedSkip + parsedLimit)
    };
    
    handleResponse(res, result, 'Problems retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};
