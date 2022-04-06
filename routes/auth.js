var express = require("express");
var router = express.Router();

function verifyEmail(emailStr) {
  var regExp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  if (emailStr.match(regExp) != null) {
    return true;
  } else {
    return false;
  }
}

router.post("", function (req, res, next) {
  console.log(req.body);
  console.log("/users/login");
  if (verifyEmail(req.body.email)) {
    res.send("success", 200);
  } else {
    res.send("fail", 400);
  }
});

router.get("", function (req, res, next) {
    res.send("respond with a resource");
});


module.exports = router;
