const models = require("../models");
const errorMsg = require("../message/msg_error");
const infoMsg = require("../message/msg_info");
const logger = require("../config/logger");


exports.getUserAnimal = async function (req, res, next) {
	logger.info(`${req.method} ${req.url}`);
	if (req.userId)
		logger.info(req.userId + ":" + `${req.method} ${req.url}`);
	try {
		// DB에서 유저가 가진 모든 동물 조회후 반환
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
					model: models.body_item,
					attributes: ["filename"],
				},
				{
					model: models.foot_item,
					attributes: ["filename"],
				},
				{
					model: models.pattern,
					attributes: ["filename"],
				},
			],
			attributes: ["name", "tier", "color"],
			raw: true,
		});
		userAnimal.forEach(element => {
			element.animalType = element["animal.type"];
			element.headItem = element["head_item.filename"];
			element.bodyItem = element["body_item.filename"];
			element.footItem = element["foot_item.filename"];
			element.pattern = element["pattern.filename"];
			delete element["animal.type"];
			delete element["head_item.filename"];
			delete element["body_item.filename"];
			delete element["foot_item.filename"];
			delete element["pattern.filename"];
		});
		return res.status(200).send({"data" : userAnimal});
	} catch (e) {
		console.log(e);
		logger.error(`${req.method} ${req.url}` + ": " + e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};

exports.getNewAnimal = async function (req, res, next) {
	logger.info(`${req.method} ${req.url}`);
	try {
		// 새로운 동물 생성
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
				console.log(user);
			});

		return res.status(201).send(animal);
	} catch (e) {
		logger.error(`${req.method} ${req.url}` + ": " + e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};

exports.changeAnimalColor = async function (req, res, next) {
	logger.info(`${req.method} ${req.url}`);
	const { animalId, color } = req.body;
	if (color === undefined) {
		return res.status(400).send(errorMsg.needParameter);
	}
	try {
		await models.animal_possession.update({ color: color }, { where: { id: animalId } });
		return res.status(200).send(infoMsg.success);
	} catch (e) {
		console.log(e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};



