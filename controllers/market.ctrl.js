const models = require("../models");
const sequelize = require("../models").sequelize;
const errorMsg = require("../message/msg_error");
const infoMsg = require("../message/msg_info");
const logger = require("../config/logger");
const nftUtils = require("../utils/nft.utils");

// Show Market Animl
exports.getAllMarketAnimal = async function (req, res) {
	logger.info(`${req.method} ${req.originalUrl}`);

	// Setting Default
	if (!req.query.page || req.query.page < 1) {
		req.query.page = 1;
	}
	if (!req.query.limit) {
		req.query.limit = 5;
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
					attributes: ['animal_type', 'name', 'color', 'head_item_id'],
					include: [
						{
							model: models.animal,
							attributes: ['type'],
						},
						{
							model: models.head_item,
							attributes: ['filename'],
						}
					]
				}],
			raw: true,
			attributes: ["id", "price", "view_count", "description", "updatedAt"],
		});
		let result = [];
		allAnimal.forEach(element => {
			data = {
				"id": element["id"],
				"price": element["price"],
				"view_count": element["view_count"],
				"description": element["description"],
				"updatedAt": element["updatedAt"],
				"username": element["user.username"],
				"animal_type": element["animal_possession.animal.type"],
				"animal_name": element["animal_possession.name"],
				"color": element["animal_possession.color"],
				"head_item": element["animal_possession.head_item.filename"]
			}
			result.push(data);
		});
		res.status(200).send(result);
	} catch (e) {
		logger.error(e);
		res.status(500).send(errorMsg.internalServerError);
	}
};

exports.getMarketAnimalCounts = async function (req, res) {
	logger.info(`${req.method} ${req.originalUrl}`);
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

exports.getMarketAnimalDetail = async function (req, res) {
	logger.info(`${req.method} ${req.originalUrl}`);
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


// Sell Market Animal
exports.sellAnimaltoMarket = async function (req, res) {
	logger.info(`${req.method} ${req.originalUrl}`);
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
		let uploadedAnimal = await models.market.findOne({ where: { animal_possession_id: req.body.animal_id } });
		if (uploadedAnimal) {
			return res.status(400).send(errorMsg.alreadyUploaded);
		}
		if (!animal.nft_id) {
			result = {
				"status": "fail",
				"msg": "Don't have NFT animal"
			}
			return res.status(400).send(result);
		}
		let nftInfo = await models.nft.findOne({ where: { id: animal.nft_id } }, { transaction: tr });
		// approve NFT to Operator
		let approve = await nftUtils.approveToOperator(seller_private_key, nftInfo.contract_addr, nftInfo.token_id);
		if (!approve) {
			new Error("approveToOperator error");
		}
		// upload to market
		await models.market.create({
			price: price,
			view_count: 0,
			description: "This Animal Is NFT Animal",
			animal_possession_id: animal_id,
			user_id: req.userId,
		}, { transaction: tr });
		await tr.commit();
		return res.status(200).send(infoMsg.success);
	} catch (e) {
		logger.error(e);
		await tr.rollback();
		res.status(500).send(errorMsg.internalServerError);
	}
};


// Buy Market Animal
exports.buyAnimalfromMarket = async function (req, res) {
	logger.info(`${req.method} ${req.originalUrl}`);
	const { buy_animal_id } = req.body;
	if (!buy_animal_id) {
		return res.status(400).send(errorMsg.needParameter);
	}
	const tr = await sequelize.transaction();
	try {
		const buy_user = await models.user.findOne({ where: { id: req.userId } });
		const animal = await models.market.findOne({ where: { id: buy_animal_id } });
		const seller = await models.user.findOne({ where: { id: animal.user_id } });
		if (buy_user.id === animal.user_id) {
			return res.status(401).send(errorMsg.cannotBuyYourAnimal);
		}
		if (animal.price > buy_user.coin) {
			await tr.commit();
			return res.status(401).send(errorMsg.notEnoughCoin)
		}
		if (buy_user.wallet_address == null) {
			await tr.rollback();
			return res.status(401).send(errorMsg.needWalletAddress);
		}

		// Trade NFT by Operator
		const animalInfo = await models.animal_possession.findOne({ where: { id: animal.animal_possession_id } });
		const nftInfo = await models.nft.findOne({ where: { id: animalInfo.nft_id } });
		let tradeResult = await nftUtils.tradeNftByOperator(nftInfo.contract_addr, nftInfo.token_id, buy_user.wallet_address, seller.wallet_address);
		if (!tradeResult) {
			new Error("tradeNftByOperator error");
		}

		// Set Animal Update
		await models.user.update({ coin: buy_user.coin - animal.price }, { where: { id: req.userId } }, { transaction: tr });
		await models.user.update({ coin: seller.coin + animal.price }, { where: { id: animal.user_id } }, { transaction: tr });
		await models.animal_possession.update({ user_id: req.userId }, { where: { id: animal.animal_possession_id }, transaction: tr });
		await models.market.destroy({ where: { id: buy_animal_id } }, { transaction: tr });

		await tr.commit();
		return res.status(200).send(infoMsg.success);
	} catch (e) {
		logger.error(e);
		await tr.rollback();
		res.status(500).send(errorMsg.internalServerError);
	}
};
