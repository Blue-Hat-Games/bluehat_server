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
	var try_count = 0;
	const max_try_count = 3; //블록체인 상에 http 요청이 정상적으로 전달되지 않은 경우 3번까지 시도
	while (try_count < max_try_count) {
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
		}
		try_count++;
	}
	if (try_count == max_try_count) {
		await models.animal_possession.update({ nft_id: -1 }, { where: { id: animal_id } });//nft_id가 -1인 경우는 블록체인에 등록되지 않은 것
		return res.status(500).send(errorMsg.internalServerError);
	}
};

