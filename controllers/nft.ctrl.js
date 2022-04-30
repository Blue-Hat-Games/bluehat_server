const models = require("../models");
const nftUtils = require("../utils/nft.utils");
const errorMsg = require("../message/msg_error");
const infoMsg = require("../message/msg_info");
const verifyUtils = require("../utils/verify");
const { Op } = require("sequelize");

exports.mergeAnimal = async function (req, res, next) {
	const { animalId1, animalId2, color } = req.body;
	if (animalId1 === undefined || animalId2 === undefined) {
		return res.status(400).send(errorMsg.needParameter);
	}
	try {
		// NFT가 아니고, 두가지 속성중 무작위 하나 선택
		let animals = await models.animal_possession.findAll({
			where: { [Op.or]: [{ id: animalId1 }, { id: animalId2 }] },
		});

        let user_wallet = await models.user.findOne({ where : { id : req.userId }});
        console.log(user_wallet.wallet_address);

		function randomVal() {
			return Math.round(Math.random());
		}
		let new_animal = {
			name: animals[randomVal()].name,
			tier: animals[randomVal()].tier,
			user_id: req.userId,
			color: color,
			animal_id: animals[randomVal()].animal_id,
			head_item_id: animals[randomVal()].head_item_id,
			body_item_id: animals[randomVal()].body_item_id,
			foot_item_id: animals[randomVal()].foot_item_id,
			pattern_id: animals[randomVal()].pattern_id,
		};

        let nftMintResult = await nftUtils.getNft(title='mergeAnimal', symbol=verifyUtils.encryptValtest(JSON.stringify(new_animal)), toAddr=user_wallet.wallet_address);
        console.log(nftMintResult);
        new_animal['nft_hash'] = nftMintResult.transactionHash;

		let new_animals = await models.animal_possession.create(new_animal);

		await models.animal_possession
			.destroy({
				where: { [Op.or]: [{ id: animalId1 }, { id: animalId2 }] },
			})
			.then(console.log("merge success"));

		return res.status(200).send(new_animals);

	} catch (e) {
		console.log(e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};
