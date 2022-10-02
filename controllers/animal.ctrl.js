const models = require("../models");
const errorMsg = require("../message/msg_error");
const infoMsg = require("../message/msg_info");
const logger = require("../config/logger");
const colorUtils = require("../utils/color.utils");

exports.getUserAnimal = async function (req, res, next) {
	logger.info(`${req.method} ${req.url}`);
	if (req.userId)
		logger.info(req.userId + ":" + `${req.method} ${req.url}`);
	try {
		let userId = req.userId;
		let userAnimal = await models.animal_possession.findAll({
			where: { user_id: userId },
			include: [
				{
					model: models.animal,
					attributes: ["type"],
				},
				{
					model: models.head_item,
					attributes: ["filename"],
				},
				{
					model: models.pattern,
					attributes: ["filename"],
				},
			],
			attributes: ["name", "tier", "color", "id"],
			raw: true,
		});
		userAnimal.forEach(element => {
			element.animalType = element["animal.type"];
			element.headItem = element["head_item.filename"];
			element.pattern = element["pattern.filename"];
			delete element["animal.type"];
			delete element["head_item.filename"];
			delete element["pattern.filename"];
		});
		return res.status(200).send({ "data": userAnimal });
	} catch (e) {
		logger.error(`${req.method} ${req.url}` + ": " + e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};

exports.makeNewAnimal = async function (req, res, next) {
	/*
		1. Create New Animal to user
	*/
	logger.info(`${req.method} ${req.url}`);
	try {
		const allAnimalLength = await models.animal.count();
		let animalPickIndex = Math.floor(Math.random() * allAnimalLength + 1);
		let animal = await models.animal.findOne({ where: { id: animalPickIndex } });

		await models.animal_possession
			.create({
				nft_hash: null,
				color: null,
				name: "testAnimal",
				tier: 1,
				user_id: req.userId,
				animal_id: animal.id,
				head_item_id: 1,
				body_item_id: 1,
				foot_item_id: 1,
				pattern_id: 1,
			})
			.then((user) => {
				logger.info(user);
			});

		return res.status(201).send(animal);
	} catch (e) {
		logger.error(`${req.method} ${req.url}` + ": " + e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};

exports.changeAnimalColor = async function (req, res, next) {
	/*
		1. Change Animal Color
	*/
	logger.info(`${req.method} ${req.url}`);
	const { animalId, color } = req.body;
	let new_color = colorUtils.changeColor(color, animalId);
	if (color === undefined) {
		return res.status(400).send(errorMsg.needParameter);
	}
	try {
		await models.animal_possession.update({ color: new_color }, { where: { id: animalId } });
		return res.status(200).send(infoMsg.success);
	} catch (e) {
		logger.error(`${req.method} ${req.url}` + ": " + e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};

exports.updateAnimal = async function (req, res, next) {

	logger.info(`${req.method} ${req.url}`);
	const { name, tier, color, id, animalType, headItem, pattern } = req.body.data;
	if (id === undefined || name === undefined || tier === undefined || color === undefined || animalType === undefined || headItem === undefined || pattern === undefined) {
		return res.status(400).send(errorMsg.needParameter);
	}
	try {
		const head_item_id = await models.head_item.findOne({ where: { filename: headItem } });
		const pattern_id = await models.pattern.findOne({ where: { filename: pattern } });
		const animal_id = await models.animal.findOne({ where: { type: animalType } });
		await models.animal_possession.update({ name: name, color: color, animal_id: animal_id.id, head_item_id: head_item_id.id, pattern_id: pattern_id.id }, { where: { id: id } });
	} catch (e) {
		logger.error(`${req.method} ${req.url}` + ": " + e);
		return res.status(500).send(errorMsg.internalServerError);
	}
}