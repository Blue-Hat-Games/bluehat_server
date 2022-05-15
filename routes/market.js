var express = require("express");
var router = express.Router();
const marketCtrl = require("../controllers/market.ctrl");
const { verifyToken } = require('../middlewares/verify');

router.get("", marketCtrl.getAllMarketAnimal);
router.post("/sell", verifyToken, marketCtrl.sellAnimaltoMarket);
router.get("/counts", marketCtrl.getMarketAnimalCounts);

module.exports = router;