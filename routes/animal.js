var express = require("express");
var router = express.Router();
const animalCtrl = require('../controllers/animal.ctrl');

router.get("", animalCtrl.getUserAnimal);
router.post("", animalCtrl.getNewAnimal);
router.post("/change-color", animalCtrl.changeAnimalColor);
router.post("/merge", animalCtrl.mergeAnimal);

module.exports = router;