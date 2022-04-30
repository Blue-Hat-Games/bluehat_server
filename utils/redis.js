const redis = require("redis");
const redisClient = redis.createClient();

redisClient.on("error", function (err) {
  console.log("Error " + err);
});

redisClient.connect("error", function (err) {
  console.log("Error " + err);
});

module.exports = redisClient;
