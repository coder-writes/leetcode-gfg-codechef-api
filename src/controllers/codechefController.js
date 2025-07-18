import codechefClient from '../utils/codechef-client.js';
import { handleError, handleResponse, validateUsername } from '../utils/helpers.js';

export const getCodeChefUserProfile = async (req, res) => {
  try {
    const username = validateUsername(req.params.username);
    
    const profileData = await codechefClient.scrapeUserProfile(username);
    
    // Get rating history if available
    let ratingHistory = [];
    try {
      ratingHistory = await codechefClient.getUserRatingHistory(username);
    } catch (historyError) {
      console.warn(`Rating history not available for ${username}:`, historyError.message);
      // Continue without rating history
    }
    
    const result = {
      platform: 'CodeChef',
      username: profileData.username,
      fullName: profileData.fullName,
      country: profileData.country,
      institution: profileData.institution,
      currentRating: profileData.currentRating,
      maxRating: profileData.maxRating,
      globalRank: profileData.globalRank,
      countryRank: profileData.countryRank,
      stars: profileData.stars,
      totalContests: profileData.contestStats.totalContests,
      contestStats: profileData.contestStats,
      ratingHistory: ratingHistory,
      profileUrl: profileData.profileUrl,
      note: ratingHistory.length === 0 ? 'Rating history may be unavailable due to CodeChef access restrictions' : undefined
    };
    
    handleResponse(res, result, 'CodeChef user profile retrieved successfully');
  } catch (error) {
    handleError(res, error, error.message.includes('not found') ? 404 : 500);
  }
};

export const getCodeChefUserRating = async (req, res) => {
  try {
    const username = validateUsername(req.params.username);
    
    const profileData = await codechefClient.scrapeUserProfile(username);
    
    const result = {
      platform: 'CodeChef',
      username: profileData.username,
      fullName: profileData.fullName,
      currentRating: profileData.currentRating || 0, // Return 0 if no contests given
      maxRating: profileData.maxRating || 0,
      stars: profileData.stars,
      totalContests: profileData.contestStats.totalContests,
      contestTypes: {
        longChallenge: profileData.contestStats.longChallengeRating || 0,
        cookOff: profileData.contestStats.cookOffRating || 0,
        lunchTime: profileData.contestStats.lunchTimeRating || 0
      }
    };
    
    handleResponse(res, result, 'CodeChef user rating retrieved successfully');
  } catch (error) {
    handleError(res, error, error.message.includes('not found') ? 404 : 500);
  }
};

export const getCodeChefUserRanking = async (req, res) => {
  try {
    const username = validateUsername(req.params.username);
    
    const profileData = await codechefClient.scrapeUserProfile(username);
    
    const result = {
      platform: 'CodeChef',
      username: profileData.username,
      fullName: profileData.fullName,
      currentRating: profileData.currentRating || 0,
      globalRank: profileData.globalRank || 0,
      countryRank: profileData.countryRank || 0,
      country: profileData.country,
      stars: profileData.stars,
      totalContests: profileData.contestStats.totalContests
    };
    
    handleResponse(res, result, 'CodeChef user ranking retrieved successfully');
  } catch (error) {
    handleError(res, error, error.message.includes('not found') ? 404 : 500);
  }
};

export const getCodeChefUserStats = async (req, res) => {
  try {
    const username = validateUsername(req.params.username);
    
    const profileData = await codechefClient.scrapeUserProfile(username);
    
    // Try to get rating history, but don't fail if it's not available
    let ratingHistory = [];
    try {
      ratingHistory = await codechefClient.getUserRatingHistory(username);
    } catch (historyError) {
      console.warn(`Rating history not available for ${username}:`, historyError.message);
      // Continue without rating history
    }
    
    const result = {
      platform: 'CodeChef',
      username: profileData.username,
      fullName: profileData.fullName,
      country: profileData.country,
      institution: profileData.institution,
      ratings: {
        current: profileData.currentRating || 0,
        max: profileData.maxRating || 0,
        stars: profileData.stars
      },
      rankings: {
        global: profileData.globalRank || 0,
        country: profileData.countryRank || 0
      },
      contests: {
        total: profileData.contestStats.totalContests,
        longChallenge: profileData.contestStats.longChallengeRating || 0,
        cookOff: profileData.contestStats.cookOffRating || 0,
        lunchTime: profileData.contestStats.lunchTimeRating || 0
      },
      ratingHistory: ratingHistory,
      profileUrl: profileData.profileUrl,
      note: ratingHistory.length === 0 ? 'Rating history may be unavailable due to CodeChef access restrictions' : undefined
    };
    
    handleResponse(res, result, 'CodeChef user statistics retrieved successfully');
  } catch (error) {
    handleError(res, error, error.message.includes('not found') ? 404 : 500);
  }
};

export const getCodeChefContests = async (req, res) => {
  try {
    const contests = await codechefClient.getContestList();
    
    const result = {
      platform: 'CodeChef',
      contests: contests,
      totalContests: contests.length
    };
    
    handleResponse(res, result, 'CodeChef contests retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};
