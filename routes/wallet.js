var express = require("express");
var router = express.Router();
const walletCtrl = require("../controllers/wallet.ctrl");
const { verifyToken } = require('../middlewares/verify');

router.post("/create-new-wallet", verifyToken, walletCtrl.createNewWallet);

module.exports = router;