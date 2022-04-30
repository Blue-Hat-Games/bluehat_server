var express = require("express");
var router = express.Router();
const animalCtrl = require('../controllers/animal.ctrl');
const { verifyToken } = require('../middlewares/verify');

router.get("", verifyToken, animalCtrl.getUserAnimal);
router.post("", verifyToken,animalCtrl.getNewAnimal);
router.post("/change-color",verifyToken, animalCtrl.changeAnimalColor);
router.post("/merge", verifyToken,animalCtrl.mergeAnimal);

module.exports = router;