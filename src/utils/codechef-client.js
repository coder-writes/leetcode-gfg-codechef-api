import axios from 'axios';
import * as cheerio from 'cheerio';
import { CODECHEF_BASE_URL, CODECHEF_DEFAULT_HEADERS } from '../config/codechef-constants.js';

class CodeChefClient {
  constructor() {
    this.client = axios.create({
      baseURL: CODECHEF_BASE_URL,
      headers: CODECHEF_DEFAULT_HEADERS,
      timeout: 30000
    });
    
    // Add response interceptor to handle common errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 403) {
          // 403 errors are common with CodeChef due to anti-bot protection
          // Don't throw, let the calling method handle it gracefully
          return Promise.reject(new Error('CodeChef access restricted (anti-bot protection)'));
        }
        return Promise.reject(error);
      }
    );
  }

  async scrapeUserProfile(username) {
    try {
      const profileUrl = `/users/${username}`;
      const response = await this.client.get(profileUrl);
      
      if (response.status !== 200) {
        throw new Error(`User ${username} not found`);
      }

      const $ = cheerio.load(response.data);
      
      // Extract user information from the page
      const fullName = $('.user-details-container .h2-style').first().text().trim() || 
                      $('.user-details-container h1').first().text().trim() || 
                      username;
      
      const country = $('.user-details-container .user-country-name').text().trim() || 
                     $('.user-details .country').text().trim() || 
                     'Not specified';
      
      const institution = $('.user-details-container .user-institution').text().trim() || 
                         $('.user-details .institution').text().trim() || 
                         'Not specified';
      
      // Extract ratings with multiple fallback selectors
      let currentRating = 0;
      let maxRating = 0;
      let globalRank = 0;
      let countryRank = 0;
      
      // Try multiple selectors for rating
      const ratingSelectors = [
        '.rating-number',
        '.rating .number',
        '.user-rating .rating-number',
        '.rating-data .rating'
      ];
      
      for (const selector of ratingSelectors) {
        const ratingElement = $(selector).first();
        if (ratingElement.length > 0) {
          const ratingText = ratingElement.text().trim();
          currentRating = parseInt(ratingText.replace(/[^0-9]/g, '')) || 0;
          if (currentRating > 0) break;
        }
      }
      
      // Extract max rating with fallbacks
      const maxRatingElement = $('.rating-header .rating-number').eq(1);
      if (maxRatingElement.length > 0) {
        maxRating = parseInt(maxRatingElement.text().trim().replace(/[^0-9]/g, '')) || currentRating;
      } else {
        maxRating = currentRating; // Fallback to current rating
      }
      
      // Extract rankings with error handling
      try {
        const rankElements = $('.ranking-table tr, .rank-table tr');
        rankElements.each((index, element) => {
          const rankText = $(element).find('td').eq(1).text().trim();
          const rankType = $(element).find('td').eq(0).text().trim().toLowerCase();
          
          if (rankType.includes('global') || rankType.includes('world')) {
            globalRank = parseInt(rankText.replace(/[^0-9]/g, '')) || 0;
          } else if (rankType.includes('country')) {
            countryRank = parseInt(rankText.replace(/[^0-9]/g, '')) || 0;
          }
        });
      } catch (rankError) {
        console.warn(`Could not extract rankings for ${username}:`, rankError.message);
      }
      
      // Extract contest statistics
      const contestStats = this.extractContestStats($);
      
      // Extract star rating
      const stars = $('.rating .star, .user-rating .star').length;
      
      return {
        username,
        fullName,
        country,
        institution,
        currentRating,
        maxRating,
        globalRank,
        countryRank,
        stars,
        contestStats,
        profileUrl: `${CODECHEF_BASE_URL}/users/${username}`
      };
      
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error(`User ${username} not found on CodeChef`);
      } else if (error.message.includes('anti-bot protection')) {
        // Handle 403 gracefully by returning minimal data
        console.warn(`CodeChef anti-bot protection encountered for ${username}. Returning minimal data.`);
        return {
          username,
          fullName: username,
          country: 'Not available',
          institution: 'Not available',
          currentRating: 0,
          maxRating: 0,
          globalRank: 0,
          countryRank: 0,
          stars: 0,
          contestStats: {
            totalContests: 0,
            longChallengeRating: 0,
            cookOffRating: 0,
            lunchTimeRating: 0,
            ratingHistory: []
          },
          profileUrl: `${CODECHEF_BASE_URL}/users/${username}`,
          note: 'Limited data due to CodeChef access restrictions'
        };
      }
      throw new Error(`Failed to fetch CodeChef profile: ${error.message}`);
    }
  }

  extractContestStats($) {
    const contestStats = {
      totalContests: 0,
      longChallengeRating: 0,
      cookOffRating: 0,
      lunchTimeRating: 0,
      ratingHistory: []
    };

    // Try to extract contest participation from various sections
    const statsTable = $('.rating-table, .contest-stats-table');
    if (statsTable.length > 0) {
      statsTable.find('tr').each((index, row) => {
        const cells = $(row).find('td');
        if (cells.length >= 2) {
          const contestType = cells.eq(0).text().trim().toLowerCase();
          const rating = parseInt(cells.eq(1).text().trim()) || 0;
          
          if (contestType.includes('long')) {
            contestStats.longChallengeRating = rating;
          } else if (contestType.includes('cook')) {
            contestStats.cookOffRating = rating;
          } else if (contestType.includes('lunch')) {
            contestStats.lunchTimeRating = rating;
          }
        }
      });
    }

    // Count total contests from participation history if available
    const contestHistory = $('.contest-participation-table, .rating-history');
    if (contestHistory.length > 0) {
      contestStats.totalContests = contestHistory.find('tr').length - 1; // Subtract header row
    }

    return contestStats;
  }

  async getUserRatingHistory(username) {
    try {
      // Try to get rating history from the ratings API endpoint
      const ratingsUrl = `/api/ratings/user/${username}`;
      const response = await this.client.get(ratingsUrl);
      
      if (response.data && response.data.success) {
        return response.data.data || [];
      }
      
      return [];
    } catch (error) {
      // If API fails due to 403 or other errors, try alternative approach
      if (error.response && error.response.status === 403) {
        console.warn(`CodeChef API access restricted for ${username}. This is normal due to anti-bot protection.`);
      } else {
        console.warn(`Could not fetch rating history for ${username}:`, error.message);
      }
      
      // Return empty array as fallback - this is expected behavior
      return [];
    }
  }

  async getContestList() {
    try {
      const contestsUrl = '/api/list/contests/all';
      const response = await this.client.get(contestsUrl);
      
      if (response.data && response.data.success) {
        return response.data.data || [];
      }
      
      return [];
    } catch (error) {
      console.warn('Could not fetch contest list:', error.message);
      return [];
    }
  }
}

export default new CodeChefClient();
