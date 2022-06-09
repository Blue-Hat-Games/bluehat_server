require("dotenv").config();
const accessKeyId = process.env.KAS_ACESS_KEY_ID
const secretAccessKey = process.env.KAS_SECRET_ACESS_KEY;
const authorization = "Basic " + Buffer.from(accessKeyId + ":" + secretAccessKey).toString("base64")
const sellerPrivateKey = process.env.BAOBAB_SELLER_PRIVATE_KEY;
const option = {
  headers: [
    {
      name: "Authorization",
      value: authorization,
    },
    { name: "x-krn", value: "krn:1001:node" },
  ],
};

const Caver = require("caver-js");
const caver = new Caver(
  new Caver.providers.HttpProvider(
    "https://node-api.klaytnapi.com/v1/klaytn",
    option
  )
);

module.exports = { accessKeyId, secretAccessKey, authorization, caver, sellerPrivateKey }