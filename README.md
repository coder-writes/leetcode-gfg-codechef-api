# LeetCode & CodeChef API 🚀

A comprehensive REST API that provides access to both LeetCode and CodeChef data. Get user profiles, problem details, contest information, ratings, and more from both platforms!

## Features

- **LeetCode Data**: User profiles, badges, solved problems, contest history, submissions
- **CodeChef Data**: User profiles, ratings, rankings, contest statistics (returns 0 if no contests)
- **Problem Data**: Daily questions, problem lists with filtering, detailed problem info
- **Discussion Data**: Trending discussions, topics, and comments
- **Advanced Features**: Rate limiting, error handling, CORS support, compression

## Quick Start

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd leetcode-api

# Install dependencies
npm install

# Start the server
npm start

# For development with auto-reload
npm run dev
```

### Usage

The API will be available at `http://localhost:3000`

## API Endpoints

### 👤 User Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `/:username` | Get user profile details | `/john_doe` |
| `/:username/badges` | Get user badges | `/john_doe/badges` |
| `/:username/solved` | Get solved problems statistics | `/john_doe/solved` |
| `/:username/contest` | Get contest participation details | `/john_doe/contest` |
| `/:username/contest/history` | Get contest history | `/john_doe/contest/history` |
| `/:username/submission` | Get recent submissions (last 20) | `/john_doe/submission` |
| `/:username/submission?limit=10` | Get limited submissions | `/john_doe/submission?limit=10` |
| `/:username/acSubmission` | Get accepted submissions | `/john_doe/acSubmission` |
| `/:username/acSubmission?limit=7` | Get limited accepted submissions | `/john_doe/acSubmission?limit=7` |
| `/:username/calendar` | Get submission calendar | `/john_doe/calendar` |

### 😀 New User Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `/userProfile/:username` | Get full profile in one call | `/userProfile/john_doe` |
| `/userProfileCalendar?username=name&year=2024` | Get calendar with year | `/userProfileCalendar?username=john_doe&year=2024` |
| `/languageStats?username=name` | Get language statistics | `/languageStats?username=john_doe` |
| `/userProfileUserQuestionProgressV2/:userSlug` | Get question progress | `/userProfileUserQuestionProgressV2/john_doe` |
| `/skillStats/:username` | Get skill statistics | `/skillStats/john_doe` |
| `/userContestRankingInfo/:username` | Get contest ranking | `/userContestRankingInfo/john_doe` |

### ❓ Problem Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `/daily` | Get daily challenge question | `/daily` |
| `/dailyQuestion` | Get raw daily question data | `/dailyQuestion` |
| `/select?titleSlug=question-slug` | Get specific question details | `/select?titleSlug=two-sum` |
| `/problems` | Get problems list (20 by default) | `/problems` |
| `/problems?limit=10` | Get limited number of problems | `/problems?limit=10` |
| `/problems?tags=array+string` | Filter problems by tags | `/problems?tags=array+string` |
| `/problems?difficulty=EASY` | Filter by difficulty (EASY/MEDIUM/HARD) | `/problems?difficulty=EASY` |
| `/problems?skip=20` | Skip first N problems | `/problems?skip=20` |
| `/problems?tags=array&limit=10&skip=5` | Combined filters | `/problems?tags=array&limit=10&skip=5` |

### 💬 Discussion Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `/trendingDiscuss?first=20` | Get trending discussions | `/trendingDiscuss?first=10` |
| `/discussTopic/:topicId` | Get discussion topic | `/discussTopic/12345` |
| `/discussComments/:topicId` | Get discussion comments | `/discussComments/12345` |

## Response Format

All endpoints return data in a consistent format:

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": { ... },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Query Parameters

### Problems Endpoint

- `limit`: Number of problems to return (max 100, default 20)
- `skip`: Number of problems to skip (default 0)
- `tags`: Filter by tags (use + to separate multiple tags)
- `difficulty`: Filter by difficulty (EASY, MEDIUM, HARD)

### Example Queries

```bash
# Get user profile
curl http://localhost:3000/john_doe

# Get daily question
curl http://localhost:3000/daily

# Get 10 easy array problems
curl "http://localhost:3000/problems?difficulty=EASY&tags=array&limit=10"

# Get trending discussions
curl "http://localhost:3000/trendingDiscuss?first=5"
```

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

## Environment Variables

Create a `.env` file for configuration:

```env
PORT=3000
NODE_ENV=development
```

## Error Handling

The API includes comprehensive error handling for:
- Invalid usernames
- Non-existent users
- Malformed requests
- Rate limiting
- Network errors
- GraphQL errors

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client for GraphQL requests
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Compression** - Response compression

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the API documentation at `http://localhost:3000/`
- Verify your requests match the expected format

## Changelog

### v1.0.0
- Initial release with all LeetCode API endpoints
- User profile and statistics
- Problem data and daily questions
- Discussion and trending topics
- Rate limiting and error handling
