const models = require("../models");
const userUtils = require("../utils/users.utils");
const errorMsg = require("../message/msg_error.js");

exports.addUser = async (req, res) => {
	// Check Input Parmeter
	const { email, wallet_address, username } = req.body;
	if ((email === undefined) | (wallet_address === undefined) | (username === undefined)) {
		return res.status(400).send({ message: "email, wallet_address, username is required" });
	}

	try {
		if ((await userUtils.getAuthUser(email)) == false) {
			throw "EMAIL_NOT_VERIFIED";
		}
		let user = await models.user.findOne({ where: { email: email } });
		if (user) {
			return res.status(200).send(user);
		} else {
			user = await models.user.create({
				email: email,
				wallet_address: wallet_address,
				username: username,
				login_type: "email",
				coin: 0,
			}).then(user => {
				console.log(user);
			});
			return res.status(201).send(user);
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
