var express = require("express");
var router = express.Router();
const marketCtrl = require("../controllers/market.ctrl");
const { verifyToken } = require('../middlewares/verify');

router.get("/list", marketCtrl.getAllMarketAnimal);
router.get("/counts", marketCtrl.getMarketAnimalCounts);
router.get('/detail', marketCtrl.getMarketAnimalDetail);
router.post("/sell", verifyToken, marketCtrl.sellAnimaltoMarket);
router.post("/buy", verifyToken, marketCtrl.buyAnimalfromMarket);

module.exports = router;