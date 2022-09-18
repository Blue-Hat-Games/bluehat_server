const redis = require("redis");
const logger = require("../config/logger");
// const redisClient = redis.createClient({ url: 'redis://redis:6379' });
const redisClient = redis.createClient();

redisClient.on("error", function (err) {
	logger.error("Redis Client Error " + err);
});

redisClient.connect("error", function (err) {
	logger.error("Redis Client Error " + err);
});

module.exports = redisClient;
