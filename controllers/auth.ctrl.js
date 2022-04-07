const authUtils = require('../utils/auth.utils');

exports.verifyMail = function (req, res, next) {
    console.log(req.body);
    console.log("/users/login");
    if (authUtils.verifyEmail(req.body.email)) {
        res.send("success", 200);
    } else {
        res.send("fail", 400);
    }
}

exports.testAuthDomain = function (req, res, next) {
    res.send("respond with a resource");
}