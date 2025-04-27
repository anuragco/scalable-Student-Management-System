const redis = require('redis');
require('dotenv').config(); 


const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis-13956.c85.us-east-1-2.ec2.redns.redis-cloud.com', 
    port: process.env.REDIS_PORT || 13956 
  },
  password: process.env.REDIS_PASSWORD || 'PiTydh6CS0ZBzrrL9uKDbHcQ0jp7juGO' 
});


const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis!');
  } catch (error) {
    console.error('Redis connection error:', error);
    process.exit(1); 
  }
};

module.exports = { redisClient, connectRedis };
