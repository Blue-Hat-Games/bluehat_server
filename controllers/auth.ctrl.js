const authUtils = require("../utils/auth.utils");

exports.verifyAuthEmail = function (req, res, next) {
	try {
		const userMailAdress = req.body.email;
		const authKey = authUtils.encryptEmail(userMailAdress);

		if (authUtils.verifyEmail(userMailAdress)) {
			authUtils.setAuthUser(userMailAdress, false);
			sendResult = authUtils.sendVerifyEmail(userMailAdress, authKey);
			if (sendResult) {
				res.send("success", 200);
			} else {
				res.send("fail", 400);
			}
		} else {
			res.send("fail", 400);
		}
	} catch (e) {
		console.log(e);
	}
};

exports.verifyAuthEmailKey = function (req, res, next) {
	try {
		const userEmail = authUtils.decryptEmail(req.query.authKey);
		const validAuthkey = authUtils.validAuthUser(userEmail);
		if (validAuthkey) {
			if (authUtils.setAuthUser(userEmail, true)) {
				console.log(`${userEmail} is verified`);
			} else {
				console.log(`${userEmail} is not verified`);
			}
		} else {
			console.log(`${userEmail} is not verified`);
		}
	} catch (e) {
		console.log(e);
	} finally {
		// application Deeplink 이동
		res.redirect(301, `http://bluehat.games`);
	}
};
