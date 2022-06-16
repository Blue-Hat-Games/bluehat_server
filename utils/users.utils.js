const redisClient = require("../utils/redis");

exports.getAuthUser = async function (email) {
  if ((await redisClient.exists(email)) == 1) {
    const data = await redisClient.get(email, function (err, reply) {
      if (err) {
        console.log(err);
        return false;
      } else {
        return true;
      }
    });
    console.log(data);
    if (data == "true") {
      return true;
    } else {
      return false;
    }
  } else {
    console.log("return false");
    return false;
  }
};