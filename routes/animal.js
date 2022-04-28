var express = require("express");
var router = express.Router();
const animalCtrl = require('../controllers/animal.ctrl');

router.get("/:id", animalCtrl.getUserAnimal);
router.post("/new", animalCtrl.getNewAnimal);

module.exports = router;