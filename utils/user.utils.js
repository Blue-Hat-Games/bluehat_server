const redisClient = require("./redis");

exports.getAuthUser = async function (email) {
	if ((await redisClient.exists(email)) == 1) {
		const data = await redisClient.get(email, function (err, reply) {
			if (err) {
				return false;
			} else {
				return true;
			}
		});
		if (data == "true") {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};