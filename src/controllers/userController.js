import client from '../utils/client.js';
import { GRAPHQL_QUERIES } from '../config/constants.js';
import { handleError, handleResponse, validateUsername, validateLimit } from '../utils/helpers.js';

export const getUserProfile = async (req, res) => {
  try {
    const username = validateUsername(req.params.username);
    
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.USER_PROFILE, { username });
    
    if (!data.matchedUser) {
      return handleError(res, new Error('User not found'), 404);
    }
    
    handleResponse(res, data.matchedUser, 'User profile retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserBadges = async (req, res) => {
  try {
    const username = validateUsername(req.params.username);
    
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.USER_BADGES, { username });
    
    if (!data.matchedUser) {
      return handleError(res, new Error('User not found'), 404);
    }
    
    handleResponse(res, data.matchedUser.badges, 'User badges retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserSolved = async (req, res) => {
  try {
    const username = validateUsername(req.params.username);
    
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.USER_SUBMISSION_STATS, { username });
    
    if (!data.matchedUser) {
      return handleError(res, new Error('User not found'), 404);
    }
    
    const solvedStats = data.matchedUser.submitStatsGlobal.acSubmissionNum;
    const totalSolved = solvedStats.reduce((total, stat) => total + stat.count, 0);
    
    const result = {
      solvedProblem: totalSolved,
      easySolved: solvedStats.find(s => s.difficulty === 'Easy')?.count || 0,
      mediumSolved: solvedStats.find(s => s.difficulty === 'Medium')?.count || 0,
      hardSolved: solvedStats.find(s => s.difficulty === 'Hard')?.count || 0,
      totalQuestions: data.allQuestionsCount,
      beatsStats: data.matchedUser.problemsSolvedBeatsStats
    };
    
    handleResponse(res, result, 'User solved statistics retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserContest = async (req, res) => {
  try {
    const username = validateUsername(req.params.username);
    
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.USER_CONTEST_INFO, { username });
    
    if (!data.userContestRanking) {
      return handleError(res, new Error('Contest data not found for user'), 404);
    }
    
    const result = {
      contestAttend: data.userContestRanking.attendedContestsCount,
      contestRating: Math.round(data.userContestRanking.rating),
      contestGlobalRanking: data.userContestRanking.globalRanking,
      totalParticipants: data.userContestRanking.totalParticipants,
      contestTopPercentage: data.userContestRanking.topPercentage,
      contestBadge: data.userContestRanking.badge
    };
    
    handleResponse(res, result, 'User contest info retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserContestHistory = async (req, res) => {
  try {
    const username = validateUsername(req.params.username);
    const attendedOnly = req.params.attendedOnly === 'true' || req.query.attendedOnly === 'true';
    
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.USER_CONTEST_INFO, { username });
    
    if (!data.userContestRankingHistory) {
      return handleError(res, new Error('Contest history not found for user'), 404);
    }
    
    let contestHistory = data.userContestRankingHistory;
    
    // Filter to only attended contests if requested
    if (attendedOnly) {
      contestHistory = contestHistory.filter(contest => contest.attended === true);
    }
    
    // Sort by most recent first (descending order)
    const sortedContestHistory = contestHistory.sort((a, b) => {
      const timeA = new Date(a.contest.startTime * 1000).getTime();
      const timeB = new Date(b.contest.startTime * 1000).getTime();
      return timeB - timeA; // Descending order (most recent first)
    });
    
    const message = attendedOnly 
      ? 'User attended contest history retrieved successfully'
      : 'User contest history retrieved successfully';
    
    handleResponse(res, sortedContestHistory, message);
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserSubmissions = async (req, res) => {
  try {
    const username = validateUsername(req.params.username);
    const limit = validateLimit(req.query.limit, 20);
    
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.USER_RECENT_SUBMISSIONS, { 
      username, 
      limit 
    });
    
    if (!data.recentSubmissionList) {
      return handleError(res, new Error('No submissions found'), 404);
    }
    
    handleResponse(res, data.recentSubmissionList, 'User submissions retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserAcceptedSubmissions = async (req, res) => {
  try {
    const username = validateUsername(req.params.username);
    const limit = validateLimit(req.query.limit, 20);
    
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.USER_RECENT_SUBMISSIONS, { 
      username, 
      limit: limit * 2 // Get more to filter accepted ones
    });
    
    if (!data.recentSubmissionList) {
      return handleError(res, new Error('No submissions found'), 404);
    }
    
    const acceptedSubmissions = data.recentSubmissionList
      .filter(submission => submission.statusDisplay === 'Accepted')
      .slice(0, limit);
    
    handleResponse(res, acceptedSubmissions, 'User accepted submissions retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserCalendar = async (req, res) => {
  try {
    const username = validateUsername(req.params.username);
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
    
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.USER_CALENDAR, { 
      username, 
      year 
    });
    
    if (!data.matchedUser) {
      return handleError(res, new Error('User not found'), 404);
    }
    
    handleResponse(res, data.matchedUser.userCalendar, 'User calendar retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getFullUserProfile = async (req, res) => {
  try {
    const username = validateUsername(req.params.username);
    
    // Get all user data in parallel
    const [profileData, badgesData, contestData, submissionStats] = await Promise.all([
      client.graphqlQuery(GRAPHQL_QUERIES.USER_PROFILE, { username }),
      client.graphqlQuery(GRAPHQL_QUERIES.USER_BADGES, { username }),
      client.graphqlQuery(GRAPHQL_QUERIES.USER_CONTEST_INFO, { username }),
      client.graphqlQuery(GRAPHQL_QUERIES.USER_SUBMISSION_STATS, { username })
    ]);
    
    if (!profileData.matchedUser) {
      return handleError(res, new Error('User not found'), 404);
    }
    
    const solvedStats = submissionStats.matchedUser?.submitStatsGlobal.acSubmissionNum || [];
    const totalSolved = solvedStats.reduce((total, stat) => total + stat.count, 0);
    
    const fullProfile = {
      ...profileData.matchedUser,
      badges: badgesData.matchedUser?.badges || [],
      contestInfo: contestData.userContestRanking,
      solvedStats: {
        totalSolved,
        easySolved: solvedStats.find(s => s.difficulty === 'Easy')?.count || 0,
        mediumSolved: solvedStats.find(s => s.difficulty === 'Medium')?.count || 0,
        hardSolved: solvedStats.find(s => s.difficulty === 'Hard')?.count || 0,
        beatsStats: submissionStats.matchedUser?.problemsSolvedBeatsStats || []
      }
    };
    
    handleResponse(res, fullProfile, 'Full user profile retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserLanguageStats = async (req, res) => {
  try {
    const username = validateUsername(req.query.username || req.params.username);
    
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.LANGUAGE_STATS, { username });
    
    if (!data.matchedUser) {
      return handleError(res, new Error('User not found'), 404);
    }
    
    handleResponse(res, data.matchedUser.languageProblemCount, 'User language stats retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserSkillStats = async (req, res) => {
  try {
    const username = validateUsername(req.params.username);
    
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.SKILL_STATS, { username });
    
    if (!data.matchedUser) {
      return handleError(res, new Error('User not found'), 404);
    }
    
    handleResponse(res, data.matchedUser.tagProblemCounts, 'User skill stats retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserQuestionProgress = async (req, res) => {
  try {
    const userSlug = validateUsername(req.params.userSlug);
    
    // This would require a specific GraphQL query for question progress
    // For now, we'll return the solved stats as a placeholder
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.USER_SUBMISSION_STATS, { 
      username: userSlug 
    });
    
    if (!data.matchedUser) {
      return handleError(res, new Error('User not found'), 404);
    }
    
    handleResponse(res, data.matchedUser.submitStatsGlobal, 'User question progress retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserContestRanking = async (req, res) => {
  try {
    const username = validateUsername(req.params.username);
    
    const data = await client.graphqlQuery(GRAPHQL_QUERIES.USER_CONTEST_INFO, { username });
    
    if (!data.userContestRanking) {
      return handleError(res, new Error('Contest ranking not found for user'), 404);
    }
    
    handleResponse(res, data.userContestRanking, 'User contest ranking retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllUserData = async (req, res) => {
  try {
    const username = validateUsername(req.params.username);
    const attendedOnly = req.params.attendedOnly === 'true' || req.query.attendedOnly === 'true';
    
    // Fetch all user data in parallel for better performance
    const [
      profileData,
      badgesData,
      contestData,
      submissionStats,
      recentSubmissions,
      calendarData,
      languageStats,
      skillStats
    ] = await Promise.allSettled([
      client.graphqlQuery(GRAPHQL_QUERIES.USER_PROFILE, { username }),
      client.graphqlQuery(GRAPHQL_QUERIES.USER_BADGES, { username }),
      client.graphqlQuery(GRAPHQL_QUERIES.USER_CONTEST_INFO, { username }),
      client.graphqlQuery(GRAPHQL_QUERIES.USER_SUBMISSION_STATS, { username }),
      client.graphqlQuery(GRAPHQL_QUERIES.USER_RECENT_SUBMISSIONS, { username, limit: 10 }),
      client.graphqlQuery(GRAPHQL_QUERIES.USER_CALENDAR, { username, year: new Date().getFullYear() }),
      client.graphqlQuery(GRAPHQL_QUERIES.LANGUAGE_STATS, { username }),
      client.graphqlQuery(GRAPHQL_QUERIES.SKILL_STATS, { username })
    ]);

    // Check if main profile data exists
    if (profileData.status === 'rejected' || !profileData.value?.matchedUser) {
      return handleError(res, new Error('User not found'), 404);
    }

    const user = profileData.value.matchedUser;
    
    // Process submission statistics
    const solvedStats = submissionStats.status === 'fulfilled' && submissionStats.value?.matchedUser?.submitStatsGlobal.acSubmissionNum || [];
    const totalSolved = solvedStats.reduce((total, stat) => total + stat.count, 0);

    // Build comprehensive user data
    const result = {
      platform: 'LeetCode',
      username: user.username,
      profile: {
        ...user.profile,
        contestBadge: user.contestBadge,
        githubUrl: user.githubUrl,
        twitterUrl: user.twitterUrl,
        linkedinUrl: user.linkedinUrl
      },
      badges: badgesData.status === 'fulfilled' ? badgesData.value?.matchedUser?.badges || [] : [],
      solvedProblems: {
        totalSolved,
        easySolved: solvedStats.find(s => s.difficulty === 'Easy')?.count || 0,
        mediumSolved: solvedStats.find(s => s.difficulty === 'Medium')?.count || 0,
        hardSolved: solvedStats.find(s => s.difficulty === 'Hard')?.count || 0,
        beatsStats: submissionStats.status === 'fulfilled' ? submissionStats.value?.matchedUser?.problemsSolvedBeatsStats || [] : [],
        totalQuestions: submissionStats.status === 'fulfilled' ? submissionStats.value?.allQuestionsCount || [] : []
      },
      contestInfo: {
        ranking: contestData.status === 'fulfilled' ? contestData.value?.userContestRanking : null,
        history: contestData.status === 'fulfilled' && contestData.value?.userContestRankingHistory 
          ? (() => {
              let history = contestData.value.userContestRankingHistory;
              // Filter to only attended contests if requested
              if (attendedOnly) {
                history = history.filter(contest => contest.attended === true);
              }
              // Sort by most recent first
              return history.sort((a, b) => {
                const timeA = new Date(a.contest.startTime * 1000).getTime();
                const timeB = new Date(b.contest.startTime * 1000).getTime();
                return timeB - timeA; // Descending order (most recent first)
              });
            })()
          : []
      },
      recentSubmissions: recentSubmissions.status === 'fulfilled' ? recentSubmissions.value?.recentSubmissionList || [] : [],
      calendar: calendarData.status === 'fulfilled' ? calendarData.value?.matchedUser?.userCalendar : null,
      languageStats: languageStats.status === 'fulfilled' ? languageStats.value?.matchedUser?.languageProblemCount || [] : [],
      skillStats: skillStats.status === 'fulfilled' ? skillStats.value?.matchedUser?.tagProblemCounts : null,
      metadata: {
        dataFreshness: new Date().toISOString(),
        availableData: {
          profile: profileData.status === 'fulfilled',
          badges: badgesData.status === 'fulfilled',
          contestInfo: contestData.status === 'fulfilled',
          submissions: submissionStats.status === 'fulfilled',
          recentActivity: recentSubmissions.status === 'fulfilled',
          calendar: calendarData.status === 'fulfilled',
          languageStats: languageStats.status === 'fulfilled',
          skillStats: skillStats.status === 'fulfilled'
        },
        errors: [
          ...(profileData.status === 'rejected' ? [`Profile: ${profileData.reason?.message}`] : []),
          ...(badgesData.status === 'rejected' ? [`Badges: ${badgesData.reason?.message}`] : []),
          ...(contestData.status === 'rejected' ? [`Contest: ${contestData.reason?.message}`] : []),
          ...(submissionStats.status === 'rejected' ? [`Submissions: ${submissionStats.reason?.message}`] : []),
          ...(recentSubmissions.status === 'rejected' ? [`Recent Activity: ${recentSubmissions.reason?.message}`] : []),
          ...(calendarData.status === 'rejected' ? [`Calendar: ${calendarData.reason?.message}`] : []),
          ...(languageStats.status === 'rejected' ? [`Language Stats: ${languageStats.reason?.message}`] : []),
          ...(skillStats.status === 'rejected' ? [`Skill Stats: ${skillStats.reason?.message}`] : [])
        ]
      }
    };
    
    handleResponse(res, result, 'Complete user data retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
};
