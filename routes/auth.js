var express = require("express");
var router = express.Router();
const authCtrl = require("../controllers/auth.ctrl");

router.post("", authCtrl.verifyMail);
router.get("", authCtrl.testAuthDomain);

module.exports = router;
