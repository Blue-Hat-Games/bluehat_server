var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/users.ctrl');

router.post("/", userCtrl.addUser);
router.delete("/",userCtrl.delUser);

module.exports = router;
