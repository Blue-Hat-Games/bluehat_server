var express = require("express");
var router = express.Router();
const marketCtrl = require("../controllers/market.ctrl");

router.get("", marketCtrl.getAllMarketAnimal);

module.exports = router;