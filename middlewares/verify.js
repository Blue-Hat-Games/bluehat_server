const jwt = require("jsonwebtoken");
const decryptVal = require("../utils/verify").decryptVal;

exports.verifyToken =(req, res, next) => {
	try {
        console.log(req.headers.authorization)
		let decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET, {
			issuer: "http://bluehat.games",
		});
        console.log(decoded)
        req.userId = decryptVal(decoded.userId);
		return next();
	} catch (e) {
		if(e.name == 'TokenExpiredError'){
            return res.status(419).json({
                msg: 'Token expired'
            });
        }
        return res.status(401).json({
            msg: 'Invalid token'
        });
	}
};