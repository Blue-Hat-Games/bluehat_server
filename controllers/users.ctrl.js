const models = require("../models");
const userUtils = require("../utils/users.utils");
const errorMsg = require("../message/msg_error.js");
const infoMsg = require("../message/msg_info.js");
const { makeToken } = require("../utils/verify.js");
const logger = require("../config/logger");

exports.addUser = async (req, res) => {
	logger.info(`${req.method} ${req.url}`);
	// Check Input Parmeter
	const { email } = req.body;
	if (email === undefined) {
		return res.status(400).send(errorMsg.notEnoughRequirement);
	}

	try {
		if ((await userUtils.getAuthUser(email)) == false) {
			throw "EMAIL_NOT_VERIFIED";
		}
		let user = await models.user.findOne({ where: { email: email } });
		if (user) {
			login_result = {
				msg: 'Login Success',
				access_token: makeToken(user.id),
			}
			return res.status(200).send(login_result);
		} else {
			const { wallet_address } = req.body;
			if (wallet_address === undefined) {
				return res.status(400).send(errorMsg.notEnoughRequirement);
			}
			user = await models.user.create({
				email: email,
				wallet_address: wallet_address,
				login_type: "email",
				coin: 0,
			}).then(user => {
				register_result = {
					msg: 'Register Success',
					access_token: makeToken(user.id),
				}
				return res.status(201).send(register_result);
			});
		}
	} catch (e) {
		logger.error(`${req.method} ${req.url}` + ": " + e);
		if (e.parent !== undefined && e.parent.code == "ER_DUP_ENTRY") {
			return res.status(400).send(errorMsg.duplicateInfo);
		} else if (e == "EMAIL_NOT_VERIFIED") {
			return res.status(409).send(errorMsg.emailNotVerified);
		} else {
			return res.status(500).send(errorMsg.internalServerError);
		}
	}
};

exports.delUser = async (req, res) => {
	logger.info(`${req.method} ${req.url}`);
	const { email } = req.body;
	if (email === undefined) {
		return res.status(400).send(errorMsg.needParameter);
	}
	try {
		const user = await models.user.findOne({ where: { email: email }, attributes: ["email", 'deleted'] })
		if (user) {
			if (user.deleted) {
				return res.status(409).send(errorMsg.alreadyDeleted);
			}
			delEmail = 'deleted.' + email;
			await models.user.update({ deleted: true, email: delEmail }, { where: { email: email } });
		}
		return res.status(200).send(infoMsg.success);
	} catch (e) {
		logger.error(`${req.method} ${req.url}` + ": " + e);
		return res.send(500).send(errorMsg.internalServerError);
	}
};

exports.getUserInfo = async (req, res) => {
	logger.info(`${req.method} ${req.url}`);
	const userId = req.userId;
	try {
		const user = await models.user.findOne({ where: { id: userId }, attributes: ["username", "coin", "wallet_address", "email", "createdAt"] });
		const user_sell = await models.market.count({ where: { user_id: userId } });
		if (user) {
			let user_info = JSON.parse(JSON.stringify(user));
			user_info.createdAt = user.createdAt.toLocaleDateString();
			if (user_sell) {
				user_info['sellCount'] = user_sell;
			}
			return res.status(200).send(user_info);
		} else {
			return res.status(404).send(errorMsg.notFound);
		}
	} catch (e) {
		logger.error(`${req.method} ${req.url}` + ": " + e);
		return res.send(500).send(errorMsg.internalServerError);
	}
};

exports.editUserInfo = async (req, res) => {
	logger.info(`${req.method} ${req.url}`);
	const userId = req.userId;
	const { username, email } = req.body;
	try {
		if (username !== undefined && userId !== undefined) {
			await models.user.update({ username: username }, { where: { id: userId } });
			return res.status(200).send(infoMsg.success);
		} else {
			return res.status(400).send(errorMsg.notEnoughRequirement);
		}
	} catch (e) {
		logger.error(`${req.method} ${req.url}` + ": " + e);
		return res.send(500).send(errorMsg.internalServerError);
	}
};

exports.updateUserCoin = async (req, res) => {
	logger.info(`${req.method} ${req.url}`);
	const userId = req.userId;
	const { coin } = req.body;
	logger.info(`${userId} ${coin}`);
	try {
		if (coin !== undefined && userId !== undefined) {
			await models.user.update({ coin: coin }, { where: { id: userId } });
			return res.status(200).send(infoMsg.success);
		} else {
			return res.status(400).send(errorMsg.notEnoughRequirement);
		}

	} catch {
		logger.error(`${req.method} ${req.url}` + ": " + e);
		return res.send(500).send(errorMsg.internalServerError);
	}
};
