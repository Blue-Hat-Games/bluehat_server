const nftUtils = require("../utils/nft.utils");
const errorMsg = require("../message/msg_error");
const logger = require("../config/logger");
const models = require("../models");


exports.createNewWallet = async function (req, res) {
    // this mothod create new wallet to new users
    logger.info(`${req.method} ${req.originalUrl}`);
    try {
        let userId = req.userId;
        let keyring = await nftUtils.getKeyring();
        await nftUtils.faucetKlay(keyring.address);
        models.user.update({ wallet_address: keyring.address }, { where: { id: userId } });
        return res.status(200).send(keyring);
    } catch (e) {
        logger.error(e);
        return res.status(500).send(errorMsg.internalServerError);
    }
}
