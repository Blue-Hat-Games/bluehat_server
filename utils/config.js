require("dotenv").config();
const accessKeyId = process.env.KAS_ACESS_KEY_ID
const secretAccessKey = process.env.KAS_SECRET_ACESS_KEY;
const authorization = "Basic " + Buffer.from(accessKeyId + ":" + secretAccessKey).toString("base64")
const sellerPrivateKey = process.env.BAOBAB_SELLER_PRIVATE_KEY;
const TESTNET = 'https://api.baobab.klaytn.net:8651'
const Caver = require('caver-js');
const caver = new Caver(TESTNET);

module.exports = { accessKeyId, secretAccessKey, authorization, caver, sellerPrivateKey };