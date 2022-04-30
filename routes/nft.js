var express = require("express");
var router = express.Router();
const nftCtrl = require("../controllers/nft.ctrl");
const { verifyToken } = require('../middlewares/verify');

router.post("", verifyToken,nftCtrl.mergeAnimal);

module.exports = router;