// Rate limiting middleware
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();

  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old requests
    for (const [key, timestamps] of requests.entries()) {
      const filteredTimestamps = timestamps.filter(timestamp => timestamp > windowStart);
      if (filteredTimestamps.length === 0) {
        requests.delete(key);
      } else {
        requests.set(key, filteredTimestamps);
      }
    }

    // Get current requests for this client
    const clientRequests = requests.get(clientId) || [];
    const recentRequests = clientRequests.filter(timestamp => timestamp > windowStart);

    if (recentRequests.length >= max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil(windowMs / 1000),
        timestamp: new Date().toISOString()
      });
    }

    // Add this request
    recentRequests.push(now);
    requests.set(clientId, recentRequests);

    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': max,
      'X-RateLimit-Remaining': Math.max(0, max - recentRequests.length),
      'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
    });

    next();
  };
};

export default createRateLimiter;
