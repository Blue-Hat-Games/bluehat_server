var express = require('express');
var router = express.Router();
const hatCtrl = require('../controllers/hat.ctrl');
const { verifyToken } = require('../middlewares/verify');

router.post("/new-hat", hatCtrl.newHat);

module.exports = router;
