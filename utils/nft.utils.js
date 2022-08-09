const fs = require("fs");
var express = require("express");
var router = express.Router();

// Default Acess Key Setting
const config = require("../src/config");
const accessKeyId = config.accessKeyId;
const secretAccessKey = config.secretAccessKey;
const authorization = config.authorization;
const sellerPrivateKey = config.sellerPrivateKey;
const caver = config.caver;
const logger = require("../config/logger");

var newID = function () {
  return Math.random().toString(36).substr(2, 16);
};

exports.getNft = async function (title, symbol, toAddr) {
  const keyring = caver.wallet.keyring.createFromPrivateKey(sellerPrivateKey);

  if (!caver.wallet.getKeyring(keyring.address)) {
    const singleKeyRing =
      caver.wallet.keyring.createFromPrivateKey(sellerPrivateKey);
    caver.wallet.add(singleKeyRing);
  }

  let kip17 = await caver.kct.kip17.deploy(
    {
      name: title,
      symbol: symbol,
    },
    keyring.address
  );

  console.log(kip17.options.address);

  contractAddr = kip17.options.address;
  kip17 = new caver.kct.kip17(contractAddr);
  minted = false;
  while (true) {
    randomID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    console.log("randomID", randomID);
    try {
      owner = await kip17.ownerOf(randomID);
    } catch (e) {
      console.log("we can mint");

      tokenURI = JSON.stringify({
        sellerID: 0,
        productID: newID(),
      });

      mintResult = await kip17.mintWithTokenURI(
        toAddr,
        randomID,
        tokenURI,
        { from: keyring.address }
      );

      minted = true;
      console.log("mintResult", mintResult);
    }

    if (minted) {
      break;
    }
  }
  return mintResult
};

exports.tradeNft = async function (customerPrivateKey, contractAddr, tokenId, receiverAddr) {
  try {

    // Based on privateKey, get Keyring
    const senderKeyring = caver.wallet.keyring.createFromPrivateKey(
      customerPrivateKey
    );

    // if wallet doesn't have this keyring, add it
    if (!caver.wallet.getKeyring(senderKeyring.address)) {
      const singleKeyRing = caver.wallet.keyring.createFromPrivateKey(
        customerPrivateKey
      );
      caver.wallet.add(singleKeyRing);
    }

    // Get Kip17 Contract Instance
    const kip17 = new caver.kct.kip17(contractAddr);

    let transferResult = await kip17.transferFrom(
      senderKeyring.address,
      receiverAddr,
      tokenId,
      { from: senderKeyring.address, gas: 200000 }
    );
    if(transferResult === null){
        throw new Error("transfer failed")
    }
    else{
      logger.info('transferResult', transferResult);
      return transferResult;
    }
  }
  catch (e) {
    logger.error(e)
    logger.info(`${req.method} ${req.url}`);
    return  "err";
  }

};