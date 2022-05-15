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
		PriceLow: ["price", "ASC"],
		PriceHigh: ["price", "DESC"],
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
		let allAnimal = await models.market.findAll({
			limit: limit,
			offset: offset,
			order: [order],
			include: [
				{
					model: models.user,
					attributes: ["username"],
				},
			{
				model:models.animal_possession,
				attributes : ['animal_id']
			}],
			raw: true,
			attributes: ["id", "price", "view_count", "description", "updatedAt"],
		});
		allAnimal.forEach(element => {
			element.username = element["user.username"];
			delete element["user.username"];
			element.animal_type = element["animal_possession.animal_id"];
			delete element["animal_possession.animal_id"];
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

exports.sellAnimaltoMarket = async function (req, res, next) {
	logger.info(`${req.method} ${req.url}`);
	const {animal_id, price, seller_private_key} = req.body;
	if (!animal_id || !price || !seller_private_key) {
		return res.status(400).send(errorMsg.needParameter);
	}
	try {
		let animal = await models.animal_possession.findOne({ where: { id: req.body.animal_id, user_id: req.userId } });
		if (!animal) {
			return res.status(400).send(errorMsg.animalNotFound);
		}
		let sellAnimal = await models.market.create({
			animal_possession_id: animal_id,
			price: price,
			seller_private_key: seller_private_key,
			contract_address: "",
			token_id: "",
			user_id: req.userId,
			view_count: 0,
		});
		return res.status(200).send(infoMsg.success);
	} catch (e) {
		logger.error(e);
		res.status(500).send(errorMsg.internalServerError);
	}


}