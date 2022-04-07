var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/users.ctrl');

//가독성을 위해 여기에서는 라우터에 해당하는 컨트롤러 지정만 수행

/* GET users listing. */
router.get('/', userCtrl.responseTest);

module.exports = router;
