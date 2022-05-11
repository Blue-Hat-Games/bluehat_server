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