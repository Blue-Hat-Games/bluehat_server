var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/users.ctrl');
const { verifyToken } = require('../middlewares/verify');

router.post("/", userCtrl.addUser);
router.delete("/",userCtrl.delUser);
router.post("/edit-info", verifyToken, userCtrl.editUserInfo);
router.get('/', verifyToken,userCtrl.getUserInfo);

module.exports = router;
