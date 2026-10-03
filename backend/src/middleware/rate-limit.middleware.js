const env = require("../config/env");
const { getRedisClient } = require("../config/redis");

function createRateLimiter({
  prefix,
  windowMs,
  max,
  message = "Too many requests, please try again later",
  keyGenerator,
}) {
  const windowSeconds = Math.ceil(windowMs / 1000);

  return async function rateLimiter(req, res, next) {
    if (env.nodeEnv === "test") {
      return next();
    }

    const key = `${prefix}:${keyGenerator ? keyGenerator(req) : req.ip}`;

    try {
      const { client, ready } = getRedisClient();
      await ready;

      const count = await client.incr(key);
      if (count === 1) {
        await client.expire(key, windowSeconds);
      }

      const ttl = await client.ttl(key);

      res.set("X-RateLimit-Limit", String(max));
      res.set("X-RateLimit-Remaining", String(Math.max(max - count, 0)));
      res.set("X-RateLimit-Reset", String(Math.max(ttl, 0)));

      if (count > max) {
        return res.status(429).json({
          success: false,
          message,
        });
      }

      return next();
    } catch (error) {
      if (env.nodeEnv !== "production") {
        console.warn(`Rate limiter skipped: ${error.message}`);
      }

      return next();
    }
  };
}

const authRateLimiter = createRateLimiter({
  prefix: "rate_limit:auth",
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many auth attempts, please try again in 15 minutes",
  keyGenerator: (req) => {
    const email = req.validated?.body?.email?.toLowerCase() || "anonymous";
    return `${req.ip}:${req.path}:${email}`;
  },
});

module.exports = {
  createRateLimiter,
  authRateLimiter,
};
