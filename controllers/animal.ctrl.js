const models = require("../models");
const errorMsg = require("../message/msg_error");
const infoMsg = require("../message/msg_info");
const logger = require("../config/logger");
const colorUtils = require("../utils/color.utils");
const nftUtils = require('../utils/nft.utils');
const { Op } = require("sequelize");

exports.getUserAnimal = async function (req, res, next) {
	logger.info(`${req.method} ${req.originalUrl}`);
	if (req.userId)
		logger.info(req.userId + ":" + `${req.method} ${req.originalUrl}`);
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
		logger.error(`${req.method} ${req.originalUrl}` + ": " + e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};

exports.mergeAnimal = async function (req, res, next) {
	logger.info(`${req.method} ${req.originalUrl}`);
	const { animalId1, animalId2, tokenURL } = req.body;
	if (animalId1 === undefined || animalId2 === undefined) {
		return res.status(400).send(errorMsg.needParameter);
	}
	try {
		// NFT가 아니고, 두가지 속성중 무작위 하나 선택
		let animals = await models.animal_possession.findAll({
			where: { [Op.or]: [{ id: animalId1 }, { id: animalId2 }] },
		});
		if (!animals[0])
			return res.status(400).send(errorMsg.animalNotFound);
		//1~10 사이의 숫자
		let animal_type;
		if (Math.floor(Math.random() * 10 + 1) <= 2) {//20% 확률
			animal_type = Math.random() * (await models.animal.count()) + 1
		}
		else
			animal_type = animals[randomVal()].animal_type;
		let color = await colorUtils.synthesizeColor(animals[0].dataValues.color, animals[1].dataValues.color, animal_type);
		// let user_wallet = await models.user.findOne({ where: { id: req.userId } });

		function randomVal() {
			return Math.round(Math.random());
		}
		let new_animal = {
			name: animals[randomVal()].name,
			tier: animals[randomVal()].tier,
			user_id: req.userId,
			color: color,
			animal_type: animal_type,
			head_item_id: animals[randomVal()].head_item_id,
			pattern_id: animals[randomVal()].pattern_id,
		};

		// let nftMintResult = await nftUtils.getNft(title = 'Bluehat Animal', symbol = 'Bluehat', tokenURL, toAddr = user_wallet.wallet_address);
		// new_animal['nft_hash'] = nftMintResult.transactionHash;

		let new_animals = await models.animal_possession.create(new_animal);
		let merge_result = {
			name: new_animals.name,
			tier: new_animals.tier,
			color: color,
			id: new_animals.id,
			animalType: new_animal.animal_type,
			headItem: new_animal.head_item_id,
			pattern: new_animal.pattern_id,
		};
		await models.animal_possession
			.destroy({
				where: { [Op.or]: [{ id: animalId1 }, { id: animalId2 }] },
			})
			.then(logger.info("merge success"));

		return res.status(201).send(merge_result);

	} catch (e) {
		logger.error(e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};

exports.makeNewAnimal = async function (req, res, next) {
	/*
		1. Create New Animal to user
	*/
	logger.info(`${req.method} ${req.originalUrl}`);
	try {
		const allAnimalLength = await models.animal.count();
		let animalPickIndex = Math.floor(Math.random() * allAnimalLength + 1);
		let animal = await models.animal.findOne({ where: { id: animalPickIndex } });
		let color = colorUtils.makeDefaultColor();
		const user = await models.user.findOne({ where: { id: req.userId } });
		if (!user) {
			return res.status(400).send(errorMsg.userNotFound);
		}
		else {
			if (user.egg <= 0) {
				return res.status(400).send(errorMsg.notEnoughEgg);
			}
			else {
				user.egg -= 1;
				user.save();
			}
		}

		await models.animal_possession
			.create({
				nft_hash: null,
				color: color,
				name: "testAnimal",
				tier: 1,
				user_id: req.userId,
				animal_type: animal.id,
				head_item_id: 1,
				pattern_id: 1,
			})
			.then((user) => {
				logger.info(user);
			});

		return res.status(201).send(animal);
	} catch (e) {
		logger.error(`${req.method} ${req.originalUrl}` + ": " + e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};

exports.changeAnimalColor = async function (req, res, next) {
	/*
		1. Change Animal Color
	*/
	logger.info(`${req.method} ${req.originalUrl}`);
	try {
		const animal_id = req.body.animalId;
		if (animal_id === undefined) {
			return res.status(400).send(errorMsg.needParameter);
		}
		let animal = await models.animal_possession.findOne({
			where: { id: animal_id },
			attributes: ["animal_type", "color"],
		});
		let new_color = await colorUtils.changeColor(animal.dataValues.color, animal.dataValues.animal_type);
		await models.animal_possession.update({ color: new_color }, { where: { id: animal_id } });
		return res.status(201).send(infoMsg.success);
	} catch (e) {
		logger.error(`${req.method} ${req.originalUrl}` + ": " + e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};

exports.updateAnimal = async function (req, res, next) {

	logger.info(`${req.method} ${req.originalUrl}`);
	const { name, tier, color, id, animalType, headItem, pattern } = req.body.data;
	if (id === undefined || name === undefined || tier === undefined || color === undefined || animalType === undefined || headItem === undefined || pattern === undefined) {
		return res.status(400).send(errorMsg.needParameter);
	}
	try {
		const head_item_id = await models.head_item.findOne({ where: { filename: headItem } });
		const pattern_id = await models.pattern.findOne({ where: { filename: pattern } });
		const animal_type = await models.animal.findOne({ where: { type: animalType } });
		await models.animal_possession.update({ name: name, color: color, animal_type: animal_type.id, head_item_id: head_item_id.id, pattern_id: pattern_id.id }, { where: { id: id } });
	} catch (e) {
		logger.error(`${req.method} ${req.originalUrl}` + ": " + e);
		return res.status(500).send(errorMsg.internalServerError);
	}
}