export const handleResponse = (res, data, message = 'Success') => {
  return res.json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const handleError = (res, error, statusCode = 500) => {
  console.error('API Error:', error);
  
  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });
};

export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    throw new Error('Username is required and must be a string');
  }
  
  if (username.length < 1 || username.length > 30) {
    throw new Error('Username must be between 1 and 30 characters');
  }
  
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    throw new Error('Username can only contain letters, numbers, dots, underscores, and hyphens');
  }
  
  return username.trim();
};

export const validateLimit = (limit, defaultLimit = 20, maxLimit = 100) => {
  if (!limit) return defaultLimit;
  
  const parsedLimit = parseInt(limit, 10);
  if (isNaN(parsedLimit) || parsedLimit < 1) {
    throw new Error('Limit must be a positive number');
  }
  
  return Math.min(parsedLimit, maxLimit);
};

export const validateSkip = (skip) => {
  if (!skip) return 0;
  
  const parsedSkip = parseInt(skip, 10);
  if (isNaN(parsedSkip) || parsedSkip < 0) {
    throw new Error('Skip must be a non-negative number');
  }
  
  return parsedSkip;
};

export const parseTags = (tags) => {
  if (!tags) return [];
  
  return tags.split('+').map(tag => tag.trim().toLowerCase()).filter(Boolean);
};

export const validateDifficulty = (difficulty) => {
  if (!difficulty) return null;
  
  const validDifficulties = ['EASY', 'MEDIUM', 'HARD'];
  const upperDifficulty = difficulty.toUpperCase();
  
  if (!validDifficulties.includes(upperDifficulty)) {
    throw new Error('Difficulty must be one of: EASY, MEDIUM, HARD');
  }
  
  return upperDifficulty;
};
