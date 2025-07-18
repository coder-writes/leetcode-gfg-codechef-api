import axios from 'axios';
import * as cheerio from 'cheerio';

class GeeksforGeeksClient {
  constructor() {
    this.baseURL = 'https://www.geeksforgeeks.org';
    this.authURL = 'https://auth.geeksforgeeks.org';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0'
    };
  }

  /**
   * Fetch user data from GeeksforGeeks using the Next.js data approach
   */
  async fetchUserData(username) {
    try {
      const url = `${this.authURL}/user/${username}/practice/`;
      
      const response = await axios.get(url, {
        headers: this.headers,
        timeout: 20000,
        maxRedirects: 10
      });

      if (response.status !== 200) {
        throw new Error('Profile Not Found');
      }

      const $ = cheerio.load(response.data);
      
      // Find the script tag containing JSON data
      const scriptTag = $('script#__NEXT_DATA__[type="application/json"]');
      
      if (!scriptTag.length || !scriptTag.html()) {
        throw new Error('Could not find user data in page');
      }

      // Parse the JSON data
      let userData;
      try {
        userData = JSON.parse(scriptTag.html());
      } catch (parseError) {
        throw new Error('Failed to parse user data JSON');
      }

      const userInfo = userData?.props?.pageProps?.userInfo;
      const userSubmissions = userData?.props?.pageProps?.userSubmissionsInfo;

      if (!userInfo) {
        throw new Error('User info not found in data');
      }

      return {
        userInfo,
        userSubmissions: userSubmissions || {}
      };

    } catch (error) {
      console.error(`Error fetching user data for ${username}:`, error.message);
      throw error;
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(username) {
    try {
      const { userInfo } = await this.fetchUserData(username);
      
      return {
        username: username,
        displayName: userInfo.name || username,
        fullName: userInfo.name || '',
        profileImage: userInfo.profile_image_url || null,
        bio: userInfo.bio || '',
        location: userInfo.location || '',
        website: userInfo.website || '',
        joinDate: userInfo.created_at || '',
        followers: userInfo.followers_count || 0,
        following: userInfo.following_count || 0,
        reputation: userInfo.score || 0,
        codingScore: userInfo.score || 0,
        monthlyScore: userInfo.monthly_score || 0,
        institute: userInfo.institute_name || '',
        instituteRank: userInfo.institute_rank || '',
        languages: userInfo.languages || []
      };
    } catch (error) {
      if (error.message === 'Profile Not Found') {
        throw new Error('User not found on GeeksforGeeks');
      }
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }

  /**
   * Get user statistics and problem solving data
   */
  async getUserStats(username) {
    try {
      const { userInfo, userSubmissions } = await this.fetchUserData(username);
      
      // Calculate problems solved by difficulty
      const solvedByDifficulty = {
        easy: 0,
        medium: 0,
        hard: 0,
        basic: 0
      };

      let totalSolved = 0;
      const languageStats = {};

      // Process submissions by difficulty
      if (userSubmissions) {
        Object.keys(userSubmissions).forEach(difficulty => {
          const problems = userSubmissions[difficulty];
          const count = Object.keys(problems).length;
          const difficultyKey = difficulty.toLowerCase();
          
          if (solvedByDifficulty.hasOwnProperty(difficultyKey)) {
            solvedByDifficulty[difficultyKey] = count;
            totalSolved += count;
          }

          // Count language usage
          Object.values(problems).forEach(problem => {
            if (problem.lang) {
              languageStats[problem.lang] = (languageStats[problem.lang] || 0) + 1;
            }
          });
        });
      }

      return {
        totalProblemsSolved: userInfo.total_problems_solved || totalSolved,
        easyProblemsSolved: solvedByDifficulty.easy,
        mediumProblemsSolved: solvedByDifficulty.medium,
        hardProblemsSolved: solvedByDifficulty.hard,
        basicProblemsSolved: solvedByDifficulty.basic,
        overallScore: userInfo.score || 0,
        monthlyScore: userInfo.monthly_score || 0,
        codingScore: userInfo.score || 0,
        globalRank: userInfo.global_rank || 0,
        instituteRank: userInfo.institute_rank || 0,
        problemsSolvedByDifficulty: solvedByDifficulty,
        languageStats: languageStats,
        streakInfo: {
          currentStreak: userInfo.pod_solved_longest_streak || 0,
          longestStreak: userInfo.pod_solved_global_longest_streak || 0,
          activeDays: userInfo.active_days || 0
        },
        monthlyProgress: userInfo.monthly_progress || {},
        dataSource: 'GeeksforGeeks Next.js API'
      };
    } catch (error) {
      console.warn(`Could not fetch detailed stats for ${username}: ${error.message}`);
      return {
        totalProblemsSolved: 0,
        easyProblemsSolved: 0,
        mediumProblemsSolved: 0,
        hardProblemsSolved: 0,
        basicProblemsSolved: 0,
        overallScore: 0,
        monthlyScore: 0,
        codingScore: 0,
        globalRank: 0,
        instituteRank: 0,
        problemsSolvedByDifficulty: { easy: 0, medium: 0, hard: 0, basic: 0 },
        languageStats: {},
        streakInfo: { currentStreak: 0, longestStreak: 0, activeDays: 0 },
        note: `Statistics not available: ${error.message}`
      };
    }
  }

  /**
   * Get user solved problems count
   */
  async getUserSolved(username) {
    try {
      const stats = await this.getUserStats(username);
      
      return {
        totalSolved: stats.totalProblemsSolved,
        easySolved: stats.easyProblemsSolved,
        mediumSolved: stats.mediumProblemsSolved,
        hardSolved: stats.hardProblemsSolved,
        breakdown: stats.problemsSolvedByDifficulty
      };
    } catch (error) {
      throw new Error(`Failed to fetch solved problems: ${error.message}`);
    }
  }

  /**
   * Get user practice problems history
   */
  async getUserPracticeProblems(username) {
    try {
      const { userSubmissions } = await this.fetchUserData(username);
      
      if (!userSubmissions) {
        return {
          recentProblems: [],
          totalProblemsAttempted: 0,
          categories: {},
          note: 'No submission data available'
        };
      }

      const allProblems = [];
      const categories = {};

      // Process submissions by difficulty
      Object.keys(userSubmissions).forEach(difficulty => {
        const problems = userSubmissions[difficulty];
        const problemCount = Object.keys(problems).length;
        
        categories[difficulty.toLowerCase()] = {
          count: problemCount,
          problems: []
        };

        Object.values(problems).forEach(problem => {
          const problemData = {
            title: problem.pname || 'Unknown Problem',
            difficulty: difficulty,
            status: 'Solved',
            category: difficulty,
            questionUrl: `https://practice.geeksforgeeks.org/problems/${problem.slug}`,
            language: problem.lang || 'Unknown',
            slug: problem.slug || ''
          };

          allProblems.push(problemData);
          categories[difficulty.toLowerCase()].problems.push(problemData);
        });
      });

      return {
        recentProblems: allProblems.slice(-20), // Get last 20 problems
        totalProblemsAttempted: allProblems.length,
        categories: categories,
        problemsByDifficulty: Object.keys(userSubmissions).reduce((acc, difficulty) => {
          acc[difficulty.toLowerCase()] = Object.keys(userSubmissions[difficulty]).length;
          return acc;
        }, {}),
        dataSource: 'GeeksforGeeks Next.js API'
      };
    } catch (error) {
      console.warn(`Could not fetch practice problems for ${username}: ${error.message}`);
      return {
        recentProblems: [],
        totalProblemsAttempted: 0,
        categories: {},
        note: `Practice problems data not available: ${error.message}`
      };
    }
  }

  /**
   * Get user contest history
   */
  async getUserContestHistory(username) {
    try {
      const { userInfo } = await this.fetchUserData(username);
      
      if (!userInfo) {
        return {
          contestsParticipated: 0,
          contestHistory: [],
          averageRank: null,
          totalContests: 0,
          note: 'No contest data available'
        };
      }

      // Extract contest-related information from user data
      const contestHistory = [];
      
      // Check if there's contest information in userInfo
      if (userInfo.contests && Array.isArray(userInfo.contests)) {
        userInfo.contests.forEach(contest => {
          contestHistory.push({
            contestName: contest.name || contest.title || 'Unknown Contest',
            rank: contest.rank || contest.position || null,
            date: contest.date || contest.contestDate || null,
            status: contest.status || 'Participated',
            problems_solved: contest.problems_solved || 0
          });
        });
      }

      // Calculate average rank if we have rank data
      const ranksWithNumbers = contestHistory.filter(c => c.rank && !isNaN(parseInt(c.rank)));
      const averageRank = ranksWithNumbers.length > 0 
        ? Math.round(ranksWithNumbers.reduce((sum, c) => sum + parseInt(c.rank), 0) / ranksWithNumbers.length)
        : null;

      return {
        contestsParticipated: contestHistory.length,
        contestHistory: contestHistory.slice(0, 15), // Recent contests
        averageRank: averageRank,
        totalContests: contestHistory.length,
        lastContest: contestHistory[0] || null,
        bestRank: ranksWithNumbers.length > 0 ? Math.min(...ranksWithNumbers.map(c => parseInt(c.rank))) : null,
        dataSource: 'GeeksforGeeks Next.js API'
      };
    } catch (error) {
      console.warn(`Could not fetch contest history for ${username}: ${error.message}`);
      return {
        contestsParticipated: 0,
        contestHistory: [],
        averageRank: null,
        totalContests: 0,
        note: `Contest history data not available: ${error.message}`
      };
    }
  }

  /**
   * Get user school progress (GfG School courses)
   */
  async getUserSchoolProgress(username) {
    try {
      const { userInfo } = await this.fetchUserData(username);
      
      if (!userInfo) {
        return {
          enrolledCourses: 0,
          courses: [],
          totalProgress: 0,
          completedCourses: 0,
          note: 'No school progress data available'
        };
      }

      // Extract school/course-related information from user data
      const courses = [];
      
      // Check if there's course/school information in userInfo
      if (userInfo.courses && Array.isArray(userInfo.courses)) {
        userInfo.courses.forEach(course => {
          courses.push({
            courseName: course.name || course.title || 'Unknown Course',
            progress: course.progress || course.percentage || 0,
            status: course.status || course.state || 'In Progress',
            completedLessons: course.completed_lessons || course.completed || 0,
            totalLessons: course.total_lessons || course.total || 0
          });
        });
      }

      // If no courses array, check for other course-related fields
      if (courses.length === 0 && userInfo.education) {
        // Sometimes educational progress might be in different structure
        courses.push({
          courseName: userInfo.education.course || 'General Course',
          progress: 0,
          status: 'Unknown',
          completedLessons: 0,
          totalLessons: 0
        });
      }

      return {
        enrolledCourses: courses.length,
        courses: courses,
        totalProgress: courses.length > 0 ? 
          Math.round(courses.reduce((sum, c) => sum + (c.progress || 0), 0) / courses.length) : 0,
        completedCourses: courses.filter(c => c.status === 'completed' || c.status === 'Completed').length,
        dataSource: 'GeeksforGeeks Next.js API'
      };
    } catch (error) {
      console.warn(`Could not fetch school progress for ${username}: ${error.message}`);
      return {
        enrolledCourses: 0,
        courses: [],
        totalProgress: 0,
        completedCourses: 0,
        note: `School progress data not available: ${error.message}`
      };
    }
  }

  /**
   * Get problem of the day
   */
  async getProblemOfTheDay() {
    try {
      const url = `${this.baseURL}/problem-of-the-day/`;
      const response = await axios.get(url, {
        headers: this.headers,
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      return {
        title: $('.problem_title').first().text().trim(),
        difficulty: $('.difficulty').first().text().trim(),
        description: $('.problem_description').first().text().trim(),
        company: $('.company_tag').text().trim(),
        topics: this.extractTopics($),
        date: new Date().toISOString().split('T')[0],
        url: url
      };
    } catch (error) {
      throw new Error(`Failed to fetch problem of the day: ${error.message}`);
    }
  }

  // Helper methods
  parseNumber(text) {
    if (!text) return 0;
    const num = parseInt(text.replace(/[^\d]/g, ''), 10);
    return isNaN(num) ? 0 : num;
  }

  extractLanguages($) {
    const languages = [];
    $('.language_item').each((index, element) => {
      languages.push($(element).text().trim());
    });
    return languages;
  }

  extractLanguageStats($) {
    const stats = {};
    $('.language_stat').each((index, element) => {
      const $elem = $(element);
      const lang = $elem.find('.lang_name').text().trim();
      const count = this.parseNumber($elem.find('.problem_count').text());
      if (lang && count > 0) {
        stats[lang] = count;
      }
    });
    return stats;
  }

  extractMonthlyProgress($) {
    const progress = {};
    $('.month_progress').each((index, element) => {
      const $elem = $(element);
      const month = $elem.find('.month').text().trim();
      const problems = this.parseNumber($elem.find('.problems').text());
      if (month && problems >= 0) {
        progress[month] = problems;
      }
    });
    return progress;
  }

  extractStreakInfo($) {
    return {
      currentStreak: this.parseNumber($('.current_streak').text()),
      longestStreak: this.parseNumber($('.longest_streak').text()),
      activeDays: this.parseNumber($('.active_days').text())
    };
  }

  extractCategories($) {
    const categories = [];
    $('.category_item').each((index, element) => {
      const $elem = $(element);
      categories.push({
        name: $elem.find('.category_name').text().trim(),
        solved: this.parseNumber($elem.find('.solved_count').text()),
        total: this.parseNumber($elem.find('.total_count').text())
      });
    });
    return categories;
  }

  extractTopics($) {
    const topics = [];
    $('.topic_tag').each((index, element) => {
      topics.push($(element).text().trim());
    });
    return topics;
  }
}

export default GeeksforGeeksClient;
