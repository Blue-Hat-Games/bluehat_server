const models = require("../models");
const nftUtils = require("../utils/nft.utils");
const errorMsg = require("../message/msg_error");
const infoMsg = require("../message/msg_info");
const logger = require("../config/logger");

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
		}).then(async (newNft) => {
			await models.animal_possession.update({ nft_id: newNft.id }, { where: { id: animal_id } });
			return res.status(200).send(infoMsg.success);
		});
	} catch (e) {
		logger.error(e);
		return res.status(500).send(errorMsg.internalServerError);
	}
};

