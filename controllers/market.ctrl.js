const models = require("../models");
const sequelize = require("../models").sequelize;
const errorMsg = require("../message/msg_error");
const infoMsg = require("../message/msg_info");
const logger = require("../config/logger");
const { Op } = require("sequelize");
const nftUtils = require("../utils/nft.utils");

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
		Recently: ["createdAt", "DESC"],
		Oldest: ["createdAt", "ASC"],
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
					model: models.animal_possession,
					attributes: ['animal_type', 'name']
				}],
			raw: true,
			attributes: ["id", "price", "view_count", "description", "updatedAt"],
		});
		allAnimal.forEach(element => {
			element.username = element["user.username"];
			delete element["user.username"];
			element.animal_type = element["animal_possession.animal_type"];
			delete element["animal_possession.animal_type"];
			element.animal_name = element["animal_possession.name"];
			delete element["animal_possession.name"];
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
	const tr = await sequelize.transaction();
	try {
		let animal = await models.animal_possession.findOne({ where: { id: req.body.animal_id } }, { transaction: tr });
		if (!animal) {
			return res.status(400).send(errorMsg.animalNotFound);
		}
		let possessionUser = await models.user.findOne({ where: { id: animal["user_id"] } }, { transaction: tr }); // 소유자 검색

		//개발용 유저 사용
		possessionUser = "";
		const senderPrivateKey = ""; //테스트 개발용 임시 PrivateKey 사용
		await tr.commit();
	} catch (e) {
		logger.error(e);
		await tr.rollback();
		res.status(500).send(errorMsg.internalServerError);
	}
};

exports.sellAnimaltoMarket = async function (req, res, next) {
	logger.info(`${req.method} ${req.url}`);
	const { animal_id, price, seller_private_key } = req.body;
	if (!animal_id || !price || !seller_private_key) {
		return res.status(400).send(errorMsg.needParameter);
	}
	const tr = await sequelize.transaction();
	try {
		let animal = await models.animal_possession.findOne({ where: { id: req.body.animal_id, user_id: req.userId } });
		if (!animal) {
			return res.status(400).send(errorMsg.animalNotFound);
		}
		if (!animal.nft_hash) {
			result = {
				"status": "fail",
				"msg": "Don't have NFT animal"
			}
			return res.status(400).send(result);
		}
		let sellAnimal = await models.market.create({
			animal_possession_id: animal_id,
			price: price,
			seller_private_key: seller_private_key,
			contract_address: "",
			token_id: "",
			user_id: req.userId,
			view_count: 0,
		}, { transaction: tr });
		await tr.commit();
		return res.status(200).send(infoMsg.success);
	} catch (e) {
		logger.error(e);
		await tr.rollback();
		res.status(500).send(errorMsg.internalServerError);
	}
};

exports.getMarketAnimalCounts = async function (req, res, next) {
	logger.info(`${req.method} ${req.url}`);
	try {
		let count = await models.market.count();
		result = {
			"status": "success",
			"data": {
				"totalCount": count
			}
		}
		res.status(200).send(result);
	} catch (e) {
		logger.error(e);
		res.status(500).send(errorMsg.internalServerError);
	}
};

exports.getMarketAnimalDetail = async function (req, res, next) {
	logger.info(`${req.method} ${req.url}`);
	//req.query.id = market.id
	if (!req.query.id) {
		return res.status(400).send(errorMsg.needParameter);
	}
	try {
		let marketAnimal = await models.market.findOne({
			where: { id: req.query.id }, include: [
				{
					model: models.user,
					attributes: ["username"],
				},
				{
					model: models.animal_possession,
					attributes: ['animal_type', 'name', 'color'],
				}],
			raw: true,
			attributes: ["id", "price", "view_count", "description", "updatedAt"]
		});
		if (!marketAnimal) {
			return res.status(200).send({ "status": "fail", "data": "Not Exists Contents" });
		}
		result = {
			"status": "success",
			"data": {
				"id": marketAnimal.id,
				"price": marketAnimal.price,
				"description": marketAnimal.description,
				"updatedAt": marketAnimal.updatedAt,
				"view_count": marketAnimal.view_count,
				"username": marketAnimal["user.username"],
				"animal_type": marketAnimal["animal_possession.animal_type"],
				"animal_name": marketAnimal["animal_possession.name"],
				"animal_color": marketAnimal["animal_possession.color"],
			}
		}
		models.market.increment('view_count', { where: { id: req.query.id } });

		return res.status(200).send(result);


	} catch (e) {
		logger.error(e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};

exports.buyAnimalfromMarket = async function (req, res, next) {
	logger.info(`${req.method} ${req.url}`);
	const buy_animal_id = req.body.buy_animal_id;
	if (!buy_animal_id) {
		return res.status(400).send(errorMsg.needParameter);
	}
	const tr = await sequelize.transaction();
	try {
		const buy_user = await models.user.findOne({ where: { id: req.userId } });
		const animal = await models.market.findOne({ where: { id: buy_animal_id } });
		if (buy_user.id == animal.user_id) {
			result = {
				"status": "fail",
				"msg": "You can't buy your own animal"
			}
			return res.status(200).send(result);
		}
		if (animal.price <= buy_user.coin) {
			const result = await models.user.update({ coin: buy_user.coin - animal.price }, { where: { id: req.userId } }, { transaction: tr });
			const result2 = await models.animal_possession.update({ user_id: req.userId }, { where: { id: animal.animal_possession_id }, transaction: tr });
			await models.market.destroy({ where: { id: buy_animal_id } }, { transaction: tr });
			await tr.commit();
			return res.status(200).send(infoMsg.success);
		}
		else {
			result = {
				"status": "fail",
				"msg": "Not Enough Coin"
			}
			await tr.commit();
			return res.status(200).send(result)
		}
	} catch (e) {
		logger.error(e);
		await tr.rollback();
		res.status(500).send(errorMsg.internalServerError);
	}
};

exports.testNftTrade = async function (req, res, next) {
	try {
		logger.info(`${req.method} ${req.url}`);
		const nftResult = await nftUtils.tradeNft(req.body.customerPrivateKey, req.body.contractAddr, req.body.tokenId, req.body.receiverAddr)
		res.status(200).send(nftResult)
	} catch {
		res.status(500).send(errorMsg.internalServerError);
	}

};
