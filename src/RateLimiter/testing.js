const redisClient = require('../config/redis');

const submitCodeRateLimiter = async (req, res, next) => {
    const userId = req.result._id;
    const redisKey = `submit_cooldown:${userId}`;

    try {
        // Check if user has recent submission
        const exists = await redisClient.exists(redisKey);

        if (exists) {
            // Get remaining time
            const ttl = await redisClient.ttl(redisKey);
            return res.status(429).json({
                success: false,
                message: `Please wait ${ttl} seconds before submitting again`,
                retryAfter: ttl
            });
        }

        // Set cooldown (10 seconds)
        await redisClient.set(redisKey, 'cooldown_active', {
            EX: 10,  // Expires in 10 seconds
            NX: true // Set only if not exists
        });

        next();

    } catch (err) {
        console.error("Rate limiter error:", err);
        return res.status(503).json({
            success: false,
            message: "Service temporarily unavailable. Please try again later."
        });
    }
}

const runCodeRateLimiter = async ( req,  res, next)=>{
       const userId = req.result._id;
    const redisKey = `run_cooldown:${userId}`;

    try {
        // Check if user has recent submission
        const exists = await redisClient.exists(redisKey);

        if (exists) {
            // Get remaining time
            const ttl = await redisClient.ttl(redisKey);
            return res.status(429).json({
                success: false,
                message: `Please wait ${ttl} seconds before submitting again`,
                retryAfter: ttl
            });
        }

        // Set cooldown (10 seconds)
        await redisClient.set(redisKey, 'cooldown_active', {
            EX: 4,  // Expires in 3 seconds
            NX: true // Set only if not exists
        });

        next();

    } catch (err) {
        console.error("Rate limiter error:", err);
        return res.status(503).json({
            success: false,
            message: "Service temporarily unavailable. Please try again later."
        });
    }
}

 module.exports = {submitCodeRateLimiter, runCodeRateLimiter};