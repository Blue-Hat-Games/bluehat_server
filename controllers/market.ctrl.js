const models = require("../models");
const errorMsg = require("../message/msg_error");
const infoMsg = require("../message/msg_info");
const logger = require("../config/logger");
const { Op } = require("sequelize");

exports.getAllMarketAnimal = async function (req, res, next) {
	logger.info(`${req.method} ${req.url}`);

	// Setting Default
	if (!req.query.page) {
		req.query.page = 1;
	}
	if (!req.query.limit) {
		req.query.limit = 20;
	}
	const offset = (parseInt(req.query.page) - 1) * parseInt(req.query.limit);
	const limit = parseInt(req.query.limit);

	orderInfo = {
		Recently: ["updatedAt", "DESC"],
		Oldest: ["updatedAt", "ASC"],
	};
	if (!req.query.order) {
		req.query.order = orderInfo["Recently"];
	} else {
		if (!orderInfo[req.query.order]) {
			req.query.order = orderInfo["Recently"];
		} else {
			req.query.order = orderInfo[req.query.order];
		}
	}
	const order = req.query.order;

	try {
		let allAnimal = await models.animal_possession.findAll({
			where: { nft_hash: { [Op.ne]: null } },
			limit: limit,
			offset: offset,
			order: [order],
			include: [
				{
					model: models.user,
					attributes: ["username"],
				}]
		});
		allAnimal.forEach(element => {
			element.username = element["user.username"];
			delete element["user.username"];
		});
		res.status(200).send(allAnimal);
	} catch (e) {
		logger.error(e);
		res.status(500).send(errorMsg.internalServerError);
	}
};

exports.tradeAnimal = async function (req, res, next) {
	logger.info(`${req.method} ${req.url}`);
	if (!req.body.animal_id || !req.body.user_id) {
		return res.status(400).send(errorMsg.needParameter);
	}
	try {
		let animal = await models.animal_possession.findOne({ where: { id: req.body.animal_id } });
		if (!animal) {
			return res.status(400).send(errorMsg.animalNotFound);
		}
		let possessionUser = await models.user.findOne({ where: { id: animal["user_id"] } }); // 소유자 검색

		//개발용 유저 사용
		possessionUser = "";
		const senderPrivateKey = ""; //테스트 개발용 임시 PrivateKey 사용

	} catch (e) {
		logger.error(e);
		res.status(500).send(errorMsg.internalServerError);
	}
};
