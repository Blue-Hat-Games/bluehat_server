var express = require("express");
var router = express.Router();
const authCtrl = require("../controllers/auth.ctrl");

router.post("", authCtrl.verifyAuthEmail);
router.get("", authCtrl.verifyAuthEmailKey);

module.exports = router;
