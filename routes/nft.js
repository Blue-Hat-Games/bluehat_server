var express = require("express");
const { route } = require(".");
var router = express.Router();
const nftCtrl = require("../controllers/nft.ctrl");
const { verifyToken } = require('../middlewares/verify');

router.post("", verifyToken,nftCtrl.mergeAnimal);
router.get("/user/animal", verifyToken, nftCtrl.getUserNftAnimal);
router.get("/user/animal/count", verifyToken, nftCtrl.getUserNftAnimalCount);
router.get("/user/animal/:id", verifyToken, nftCtrl.getUserNftAnimalById);

module.exports = router;