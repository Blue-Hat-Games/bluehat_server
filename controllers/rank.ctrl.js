const models = require("../models");
const errorMsg = require("../message/msg_error");
const infoMsg = require("../message/msg_info");
const logger = require("../config/logger");
const { Op } = require("sequelize");
exports.getUserRank = async function (req, res) {
	logger.info(`${req.method} ${req.originalUrl}`);
	//get user animal possession count
	await models.animal_possession.findAll({
		group: ['user_id'],
		attributes: [
			[models.sequelize.fn('COUNT', models.sequelize.col('animal_possession.id')), 'nft_animal_count'],
			'user_id'
		],
		order: [[models.sequelize.fn('COUNT', models.sequelize.col('animal_possession.id')), 'DESC']],
		//nft_id > 0 (NFT로 등록된 동물만)
		where: {
			nft_id: {
				[Op.gt]: 0
			}
		},
		raw: true
	}).then(async (result) => {
		console.log(result);
		await models.user.findAll({
			attributes: [
				'username',
				'id'
			],
			raw: true
		}).then((result2) => {
			//merge two result
			result.forEach((item, index) => {
				result2.forEach((item2, index2) => {
					item.rank = index + 1;
					if (item.user_id == item2.id) {
						result[index].username = item2.username;
					}
				})
			})
			return res.status(200).send({ "data": result });
		}).catch((err) => {
			logger.error(`${req.method} ${req.originalUrl}` + ": " + err);
			return res.status(500).send(errorMsg.internalServerError);
		})
	}
	).catch((err) => {
		logger.error(`${req.method} ${req.originalUrl}` + ": " + err);
		return res
			.status(500)
			.send(errorMsg.internalServerError);
	})
};