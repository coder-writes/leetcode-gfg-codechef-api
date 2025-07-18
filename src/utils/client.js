import axios from 'axios';
import { LEETCODE_GRAPHQL_URL, DEFAULT_HEADERS } from '../config/constants.js';

class LeetCodeClient {
  constructor() {
    this.client = axios.create({
      baseURL: LEETCODE_GRAPHQL_URL,
      headers: DEFAULT_HEADERS,
      timeout: 30000
    });
  }

  async graphqlQuery(query, variables = {}) {
    try {
      const response = await this.client.post('', {
        query,
        variables
      });

      if (response.data.errors) {
        throw new Error(`GraphQL Error: ${response.data.errors[0].message}`);
      }

      return response.data.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network Error: Unable to reach LeetCode API');
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
  }

  async getWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(url, {
          headers: DEFAULT_HEADERS,
          timeout: 30000
        });
        return response.data;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
}

export default new LeetCodeClient();
