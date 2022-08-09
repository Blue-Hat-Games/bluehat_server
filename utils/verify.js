const jwt = require("jsonwebtoken");
const Crypto = require("crypto-js");

encryptVal = function (data) {
	return Crypto.AES.encrypt(data, process.env.USER_AUTH_KEY).toString();
};

exports.encryptValtest = function (data) {
	return Crypto.AES.encrypt(data, process.env.USER_AUTH_KEY).toString();
};


exports.decryptVal = function (data) {
	return Crypto.AES.decrypt(data, process.env.USER_AUTH_KEY).toString(Crypto.enc.Utf8);
};

exports.makeToken = function (val) {
	const token = jwt.sign({ userId: encryptVal(val.toString()) }, process.env.JWT_SECRET, {
		expiresIn: "7d",
		issuer: "http://bluehat.games",
	});
	return token;
};
