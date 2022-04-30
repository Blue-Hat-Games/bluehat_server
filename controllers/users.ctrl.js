const models = require("../models");
const userUtils = require("../utils/users.utils");
const errorMsg = require("../message/msg_error.js");
const infoMsg = require("../message/msg_info.js");
const { makeToken } = require("../utils/verify.js");

exports.addUser = async (req, res) => {
	// Check Input Parmeter
	const { email, wallet_address } = req.body;
	if ((email === undefined) | (wallet_address === undefined)) {
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
			user = await models.user.create({
				email: email,
				wallet_address: wallet_address,
				login_type: "email",
				coin: 0,
			}).then(user => {
				console.log(user);
				register_result = {
					msg: 'Register Success',
					access_token: makeToken(user.id),
				}
				return res.status(201).send(register_result);
			});
		}
	} catch (e) {
		console.log(e);
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
	const { email } = req.body;
	if (email === undefined) {
		return res.status(400).send(errorMsg.needParameter);
	}
	try {
		await models.user.destroy({ where: { email: email } });
		return res.status(200).send(infoMsg.success);
	} catch (e) {
		console.log(e);
		return res.send(500).send(errorMsg.internalServerError);
	}
}