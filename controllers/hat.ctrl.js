const models = require("../models");
const errorMsg = require("../message/msg_error");
const logger = require("../config/logger");
const hatUtils = require("../utils/hat.utils");

exports.newHat = async function (req, res) {
	logger.info(`${req.method} ${req.originalUrl}`);

	let user_id = req.userId;
	let animal_id = req.body.animalId;
	try {
		let animal = await models.animal_possession.findOne({ where: { id: animal_id } });
		if (animal.dataValues.userId != user_id) {
			return res.status(400).send(errorMsg.notYourAnimal);
		}
		if (!animal.dataValues) {
			return res.status(400).send(errorMsg.animalNotFound);
		}
		let total_head_item_cnt = await models.head_item.count();
		let new_item_id = hatUtils.getRandomHat(animal.dataValues.head_item_id, total_head_item_cnt);
		await models.animal_possession.update({ head_item_id: new_item_id }, { where: { id: animal_id } });
		let new_item = await models.head_item.findOne({
			where: { id: new_item_id },
		})
		res.status(201).send({ new_item: new_item.dataValues.filename });
	} catch (e) {
		logger.error(`${req.method} ${req.originalUrl}` + ": " + e);
		return res.status(500).send(errorMsg.internalServerError);
	}
}