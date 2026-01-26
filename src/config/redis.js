const redis = require('redis');

const redisClient = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-17624.crce179.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 17624
    }
});

module.exports = redisClient;