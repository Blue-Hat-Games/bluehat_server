var express = require("express");
var router = express.Router();
const questCtrl = require("../controllers/quest.ctrl");
const { verifyToken } = require('../middlewares/verify');

router.get('/', verifyToken, questCtrl.getUserQuest);
router.get('/count', verifyToken, questCtrl.getUserQuestCount);
router.post('/complete', questCtrl.completeQuest);
router.post("/get-reward", verifyToken, questCtrl.getQuestReward);
router.post('/create', verifyToken, questCtrl.createQuest);
router.post('/send', verifyToken, questCtrl.sendQuestToUser);
router.post('/send-all', verifyToken, questCtrl.sendQuestToAllUser);


module.exports = router;