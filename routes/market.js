var express = require("express");
var router = express.Router();
const marketCtrl = require("../controllers/market.ctrl");
const { verifyToken } = require('../middlewares/verify');

router.get("/list", marketCtrl.getAllMarketAnimal);
router.post("/sell", verifyToken, marketCtrl.sellAnimaltoMarket);
router.get("/counts", marketCtrl.getMarketAnimalCounts);
router.get('/detail', marketCtrl.getMarketAnimalDetail);
router.post("/buy", verifyToken, marketCtrl.buyAnimalfromMarket);
router.post("/trade-nft", marketCtrl.testNftTrade);
router.post("/test", marketCtrl.testKIP17Trade)
router.post("/test2", marketCtrl.sendToBuyUser)

module.exports = router;