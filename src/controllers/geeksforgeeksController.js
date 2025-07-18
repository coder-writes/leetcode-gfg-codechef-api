import GeeksforGeeksClient from '../utils/geeksforgeeks-client.js';

const gfgClient = new GeeksforGeeksClient();

/**
 * Get GeeksforGeeks user profile
 */
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required',
        timestamp: new Date().toISOString()
      });
    }

    const profile = await gfgClient.getUserProfile(username);
    
    res.json({
      success: true,
      message: 'GeeksforGeeks user profile retrieved successfully',
      data: {
        platform: 'GeeksforGeeks',
        username: username,
        ...profile
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching GeeksforGeeks user profile:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user profile',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get GeeksforGeeks user problem solving statistics
 */
export const getUserStats = async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required',
        timestamp: new Date().toISOString()
      });
    }

    const stats = await gfgClient.getUserStats(username);
    
    res.json({
      success: true,
      message: 'GeeksforGeeks user statistics retrieved successfully',
      data: {
        platform: 'GeeksforGeeks',
        username: username,
        ...stats
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching GeeksforGeeks user stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user statistics',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get GeeksforGeeks user solved problems count
 */
export const getUserSolved = async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required',
        timestamp: new Date().toISOString()
      });
    }

    const solved = await gfgClient.getUserSolved(username);
    
    res.json({
      success: true,
      message: 'GeeksforGeeks solved problems count retrieved successfully',
      data: {
        platform: 'GeeksforGeeks',
        username: username,
        ...solved
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching GeeksforGeeks solved problems:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch solved problems',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get GeeksforGeeks user practice problems
 */
export const getUserPracticeProblems = async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required',
        timestamp: new Date().toISOString()
      });
    }

    const problems = await gfgClient.getUserPracticeProblems(username);
    
    res.json({
      success: true,
      message: 'GeeksforGeeks practice problems retrieved successfully',
      data: {
        platform: 'GeeksforGeeks',
        username: username,
        ...problems
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching GeeksforGeeks practice problems:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch practice problems',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get GeeksforGeeks user contest history
 */
export const getUserContestHistory = async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required',
        timestamp: new Date().toISOString()
      });
    }

    const contests = await gfgClient.getUserContestHistory(username);
    
    res.json({
      success: true,
      message: 'GeeksforGeeks contest history retrieved successfully',
      data: {
        platform: 'GeeksforGeeks',
        username: username,
        ...contests
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching GeeksforGeeks contest history:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch contest history',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get GeeksforGeeks user school progress
 */
export const getUserSchoolProgress = async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required',
        timestamp: new Date().toISOString()
      });
    }

    const school = await gfgClient.getUserSchoolProgress(username);
    
    res.json({
      success: true,
      message: 'GeeksforGeeks school progress retrieved successfully',
      data: {
        platform: 'GeeksforGeeks',
        username: username,
        ...school
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching GeeksforGeeks school progress:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch school progress',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get ALL GeeksforGeeks user data in one comprehensive call
 */
export const getAllUserData = async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required',
        timestamp: new Date().toISOString()
      });
    }

    // Fetch all data in parallel using Promise.allSettled
    const [
      profileResult,
      statsResult,
      solvedResult,
      practiceResult,
      contestResult,
      schoolResult
    ] = await Promise.allSettled([
      gfgClient.getUserProfile(username),
      gfgClient.getUserStats(username),
      gfgClient.getUserSolved(username),
      gfgClient.getUserPracticeProblems(username),
      gfgClient.getUserContestHistory(username),
      gfgClient.getUserSchoolProgress(username)
    ]);

    // Process results
    const data = {
      platform: 'GeeksforGeeks',
      username: username,
      profile: profileResult.status === 'fulfilled' ? profileResult.value : null,
      statistics: statsResult.status === 'fulfilled' ? statsResult.value : null,
      solved: solvedResult.status === 'fulfilled' ? solvedResult.value : null,
      practiceProblems: practiceResult.status === 'fulfilled' ? practiceResult.value : null,
      contestHistory: contestResult.status === 'fulfilled' ? contestResult.value : null,
      schoolProgress: schoolResult.status === 'fulfilled' ? schoolResult.value : null,
      metadata: {
        dataFreshness: new Date().toISOString(),
        availableData: {
          profile: profileResult.status === 'fulfilled',
          statistics: statsResult.status === 'fulfilled',
          solved: solvedResult.status === 'fulfilled',
          practiceProblems: practiceResult.status === 'fulfilled',
          contestHistory: contestResult.status === 'fulfilled',
          schoolProgress: schoolResult.status === 'fulfilled'
        },
        errors: [
          ...(profileResult.status === 'rejected' ? [`Profile: ${profileResult.reason.message}`] : []),
          ...(statsResult.status === 'rejected' ? [`Statistics: ${statsResult.reason.message}`] : []),
          ...(solvedResult.status === 'rejected' ? [`Solved Problems: ${solvedResult.reason.message}`] : []),
          ...(practiceResult.status === 'rejected' ? [`Practice Problems: ${practiceResult.reason.message}`] : []),
          ...(contestResult.status === 'rejected' ? [`Contest History: ${contestResult.reason.message}`] : []),
          ...(schoolResult.status === 'rejected' ? [`School Progress: ${schoolResult.reason.message}`] : [])
        ]
      }
    };

    res.json({
      success: true,
      message: 'Complete GeeksforGeeks user data retrieved successfully',
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching complete GeeksforGeeks user data:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch complete user data',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get GeeksforGeeks problem of the day
 */
export const getProblemOfTheDay = async (req, res) => {
  try {
    const problem = await gfgClient.getProblemOfTheDay();
    
    res.json({
      success: true,
      message: 'GeeksforGeeks problem of the day retrieved successfully',
      data: {
        platform: 'GeeksforGeeks',
        ...problem
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching GeeksforGeeks problem of the day:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch problem of the day',
      timestamp: new Date().toISOString()
    });
  }
};
