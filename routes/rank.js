var express = require("express");
var router = express.Router();
const rankCtrl = require("../controllers/rank.ctrl");
const { verifyToken } = require('../middlewares/verify');

router.get('/', verifyToken, rankCtrl.getUserRank);

module.exports = router;