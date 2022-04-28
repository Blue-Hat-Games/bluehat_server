var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/users.ctrl');

router.post("/", userCtrl.addUser);

module.exports = router;
