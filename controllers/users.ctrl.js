const models = require("../models");
const userUtils = require("../utils/users.utils");

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
		user = await models.user.findOne({ where: { email: email } });
		if (user) {
			return res.status(200).send(user);
		} else {
			user = await models.user.create({
				email: email,
				wallet_address: wallet_address,
				username: username,
				login_type: "email",
				coin: 0,
			});
			return res.status(201).send(user);
		}
	} catch (e) {
		if (e.parent !== undefined && e.parent.code == "ER_DUP_ENTRY") {
			return res.status(400).send("dup email or wallet_address or username");
		} else if (e == "EMAIL_NOT_VERIFIED") {
			return res.status(409).send("email not verified");
		} else {
			return res.status(500).send("Internal Server Error");
		}
	}
};
