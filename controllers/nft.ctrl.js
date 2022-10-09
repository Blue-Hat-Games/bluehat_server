const models = require("../models");
const nftUtils = require("../utils/nft.utils");
const errorMsg = require("../message/msg_error");
const infoMsg = require("../message/msg_info");
const { Op } = require("sequelize");
const logger = require("../config/logger");
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('ipfs-api', '5001', { protocol: 'http' })

exports.getUserNftAnimal = async function (req, res, next) {
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
		let allAnimal = await models.animal_possession.findAll({
			where: { user_id: req.userId, nft_hash: { [Op.ne]: null } },
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
	logger.info(`${req.method} ${req.url}`);
	try {
		let count = await models.animal_possession.count({ where: { user_id: req.userId, nft_hash: { [Op.ne]: null } } });
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
	logger.info(`${req.method} ${req.url}`);
	if (!req.params.id) {
		return res.status(400).send(errorMsg.needParameter);
	}
	try {
		let possessionInfo = await models.animal_possession.findOne({
			where: { id: req.params.id },
			attributes: ["id", "nft_hash", "color", "name", "tier", "animal_type", "head_item_id",
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

exports.getMetaData = async function (req, res, next) {
	logger.info(`${req.method} ${req.url}`);
	if (!req.params.id) {
		return res.status(400).send(errorMsg.needParameter);
	}
	try {
		let token_id = req.params.id.replace('.json', '');
		logger.info(token_id);
		let nft_info = await models.transaction.findOne({ where: { token_id: token_id } })
		if (nft_info == null) {
			return res.status(400).send({ "msg": "Invalid" });
		}
		let json_result = {
			"image": "https://ipfs.io/ipfs/" + nft_info['ipfs_hash'],
			"description": "The bluehat animals are unique and randomly generated Bluehat. Not only that, Welcome to join us the bluehat society.",
			"name": "Bluehat Animal #" + token_id,
			"attributes": []
		}

		return res.status(200).send(json_result);
	} catch (e) {
		logger.error(e);
		return res.status(500).send(errorMsg.internalServerError);
	}

};

exports.uploadIpfs = async function (req, res) {
	logger.info(`${req.method} ${req.url}`);
	try {
		logger.info("upload ipfs");
		ipfs.files.add(req.file.buffer, function (err, file) {
			if (err) {
				logger.info(err);
				return res.status(500).send(err);
			}
			json_result = JSON.stringify({
				"image": "https://ipfs.io/ipfs/" + file[0].hash,
				"description": "The bluehat animals are unique and randomly generated Bluehat. Not only that, Welcome to join us the bluehat society.",
				"name": "Bluehat Animal",
				"attributes": []
			});

			ipfs.files.add(
				Buffer.from(json_result), function (err, json_file) {
					if (err) {
						logger.info(err);
						return res.status(500).send(err);
					}
					logger.info(file);
					return res.status(200).send({ "link": "https://ipfs.io/ipfs/" + json_file[0].hash });
				}
			)
		})

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
	logger.info(`${req.method} ${req.url}`);
	try {
		let imgHash = await nftUtils.uploadIpfsImg(req.file);
		let tokenURL = await nftUtils.uploadIpfsMeta(imgHash);
		let nftMintResult = await nftUtils.getNft(title = 'Bluehat Animal', symbol = 'Bluehat', tokenURL, toAddr = req.body.wallet_address);
		return res.status(200).send(nftMintResult);

	} catch (e) {
		logger.error(e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};

