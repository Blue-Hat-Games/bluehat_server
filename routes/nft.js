var express = require("express");
var router = express.Router();
const nftCtrl = require("../controllers/nft.ctrl");
const { verifyToken } = require('../middlewares/verify');
const { uploadFile } = require('../middlewares/file');


router.get("/user/animal", verifyToken, nftCtrl.getUserNftAnimal);
router.get("/user/animal/count", verifyToken, nftCtrl.getUserNftAnimalCount);
router.get("/user/animal/:id", verifyToken, nftCtrl.getUserNftAnimalById);
router.post("/mint", express.urlencoded({ extended: false }), express.json(), uploadFile, nftCtrl.makeNFT)

module.exports = router;