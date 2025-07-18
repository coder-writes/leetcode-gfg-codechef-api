export const CODECHEF_BASE_URL = 'https://www.codechef.com';
export const CODECHEF_API_URL = 'https://www.codechef.com/api';

// CodeChef doesn't have a public GraphQL API, so we'll use web scraping and available APIs
export const CODECHEF_ENDPOINTS = {
  USER_PROFILE: '/users/{username}',
  USER_RATINGS: '/ratings/user/{username}',
  CONTEST_LIST: '/list/contests/all',
  PROBLEM_SET: '/ide/problem-set'
};

export const CODECHEF_DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Cache-Control': 'max-age=0'
};
