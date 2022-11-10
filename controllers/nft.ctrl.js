const models = require("../models");
const nftUtils = require("../utils/nft.utils");
const errorMsg = require("../message/msg_error");
const infoMsg = require("../message/msg_info");
const { Op } = require("sequelize");
const logger = require("../config/logger");

exports.getUserNftAnimal = async function (req, res, next) {
	logger.info(`${req.method} ${req.originalUrl}`);

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
		let allAnimal = await models.animal_possession.findAll({
			where: { user_id: req.userId, nft_id: { [Op.ne]: null } },
			limit: limit,
			offset: offset,
			order: [order],
			raw: true,
		});
		return res.status(200).send(allAnimal);
	} catch (e) {
		logger.error(e);
		return res.status(500).send(errorMsg.internalServerError);
	}


};

exports.getUserNftAnimalCount = async function (req, res, next) {
	logger.info(`${req.method} ${req.originalUrl}`);
	try {
		let count = await models.animal_possession.count({ where: { user_id: req.userId, nft_id: { [Op.ne]: null } } });
		result = {
			"status": "success",
			"data": {
				"totalCount": count
			}
		}
		return res.status(200).send(result);
	} catch (e) {
		logger.error(e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};

exports.getUserNftAnimalById = async function (req, res, next) {
	logger.info(`${req.method} ${req.originalUrl}`);
	if (!req.params.id) {
		return res.status(400).send(errorMsg.needParameter);
	}
	try {
		let possessionInfo = await models.animal_possession.findOne({
			where: { id: req.params.id },
			attributes: ["id", "color", "name", "tier", "animal_type", "head_item_id",
				"pattern_id", "createdAt", "updatedAt"]
		});
		if (!possessionInfo) {
			return res.status(400).send({ "status": "fail", "msg": "No animal existed" });
		}
		return res.status(200).send(possessionInfo);
	} catch (e) {
		logger.error(e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};

exports.makeNFT = async function (req, res) {
	/*
		1. upload to IPFS
		2. create NFT
		3. save to Database
	*/
	logger.info(`${req.method} ${req.originalUrl}`);
	try {
		let { animal_id, wallet_address } = req.body;
		let imgHash = await nftUtils.uploadIpfsImg(req.file);
		let tokenURL = await nftUtils.uploadIpfsMeta(imgHash);
		let nftMintResult = await nftUtils.getNft(title = 'Bluehat Animal', symbol = 'Bluehat', tokenURL, toAddr = wallet_address);
		await models.nft.create({
			token_id: nftMintResult['events']['Transfer']['returnValues']['tokenId'],
			ipfs_addr: tokenURL,
			contract_addr: nftMintResult['events']['Transfer']['address'],
		}).then(async (nft) => {
			await models.animal_possession.update({ nft_id: nft['id'] }, { where: { id: animal_id } });
			return res.status(200).send(infoMsg.success);
		});
	} catch (e) {
		logger.error(e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};

