const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
const decryptVal = require("../utils/verify").decryptVal;

exports.verifyToken = (req, res, next) => {
    try {
        const masterKey = process.env.MASTER_KEY;
        const masterId = process.env.MASTER_ID;
        if (req.headers.authorization == masterKey) {
            req.userId = masterId
            return next();
        }
        let decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET, {
            issuer: "http://bluehat.games",
        });
        logger.info('decoded: ' + JSON.stringify(decoded));
        req.userId = decryptVal(decoded.userId);
        logger.info('req.userId: ' + req.userId);
        return next();
    } catch (e) {
        if (e.name == 'TokenExpiredError') {
            return res.status(419).json({
                msg: 'Token expired'
            });
        }
        return res.status(401).json({
            msg: 'Invalid token'
        });
    }
};