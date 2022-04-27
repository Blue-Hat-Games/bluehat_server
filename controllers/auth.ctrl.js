const authUtils = require("../utils/auth.utils");

exports.verifyAuthEmail = function (req, res, next) {
  try {
    const userMailAdress = req.body.email;
    const authKey = authUtils.encryptEmail(userMailAdress);

    authCache[userMailAdress] = false;

    if (authUtils.verifyEmail(userMailAdress)) {
      sendResult = authUtils.sendVerifyEmail(userMailAdress, authKey);
      if (sendResult) {
        res.send("success", 200);
      }
      else {
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
    console.log(`${userEmail} is verified`);
    authCache[userEmail] = true;
  } catch (e) {
    console.log(e);
  } finally {
    // application Deeplink 이동
    res.redirect(301, `http://bluehat.games`);
  }
};
