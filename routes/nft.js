var express = require("express");
var router = express.Router();
const nftCtrl = require("../controllers/nft.ctrl");
const { verifyToken } = require('../middlewares/verify');
const { uploadFile } = require('../middlewares/file');


router.post("", verifyToken, nftCtrl.mergeAnimal);
router.get("/user/animal", verifyToken, nftCtrl.getUserNftAnimal);
router.get("/user/animal/count", verifyToken, nftCtrl.getUserNftAnimalCount);
router.get("/user/animal/:id", verifyToken, nftCtrl.getUserNftAnimalById);
router.get("/metadata/:id", nftCtrl.getMetaData);
router.post("/upload-ipfs", uploadFile, nftCtrl.uploadIpfs)
router.post("/mint", express.urlencoded({ extended: false }), express.json(), uploadFile, nftCtrl.makeNFT)

module.exports = router;