const authUtils = require("../utils/auth.utils");
const infoMsg = require("../message/msg_info");
const errorMsg = require("../message/msg_error");
const logger = require("../config/logger");

exports.verifyAuthEmail = function (req, res, next) {
	logger.info(`${req.method} ${req.originalUrl}`);
	try {
		const userMailAdress = req.body.email;
		const authKey = authUtils.encryptEmail(userMailAdress);

		if (authUtils.verifyEmail(userMailAdress)) {
			authUtils.setAuthUser(userMailAdress, false);
			sendResult = authUtils.sendVerifyEmail(userMailAdress, authKey);
			if (sendResult) {
				res.status(200).send(infoMsg.success);
			} else {
				res.status(400).send(errorMsg.fail);
			}
		} else {
			res.status(400).send(errorMsg.fail);
		}
	} catch (e) {
		logger.error(`${req.method} ${req.originalUrl}` + ": " + e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};

exports.verifyAuthEmailKey = function (req, res, next) {
	logger.info(`${req.method} ${req.originalUrl}`);
	let userEmail = ''
	try {
		userEmail = authUtils.decryptEmail(req.query.authKey);
		const validAuthkey = authUtils.validAuthUser(userEmail);
		if (validAuthkey) {
			if (authUtils.setAuthUser(userEmail, true)) {
				logger.info(`${userEmail} is verified`);
			} else {
				logger.info(`${userEmail} is not verified`);
			}
		} else {
			logger.info(`${userEmail} is not verified`);
		}
	} catch (e) {
		logger.error(`${req.method} ${req.originalUrl}` + ": " + e);
	} finally {
		res.redirect(301, `http://bluehat.games/auth.html`);
	}
};
