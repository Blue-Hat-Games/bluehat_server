var express = require("express");
var router = express.Router();
const animalCtrl = require('../controllers/animal.ctrl');
const { verifyToken } = require('../middlewares/verify');

router.get("/get-user-animal", verifyToken, animalCtrl.getUserAnimal);
router.post("/make-animal", verifyToken, animalCtrl.makeNewAnimal);
router.post("/change-color", verifyToken, animalCtrl.changeAnimalColor);


module.exports = router;