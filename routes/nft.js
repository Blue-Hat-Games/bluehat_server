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

router.post("/character", async (req, res) => {
  console.log("post /character");
  console.log("name" + req.body.name);
  console.log("symbol", req.body.symbol);
  console.log("toAddr: " + req.body.toAddr);

  const keyring = caver.wallet.keyring.createFromPrivateKey(sellerPrivateKey);

  if (!caver.wallet.getKeyring(keyring.address)) {
    const singleKeyRing =
      caver.wallet.keyring.createFromPrivateKey(sellerPrivateKey);
    caver.wallet.add(singleKeyRing);
  }

  let kip17 = await caver.kct.kip17.deploy(
    {
      name: req.body.name,
      symbol: req.body.symbol,
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
        req.body.toAddr,
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

  res.send(mintResult, 200);
  console.log("end of /character post");
});

router.post("/character/test", async (req, res) => {
  console.log("post /character");
  console.log("toAddr: " + req.body.toAddr);

  const keyring = caver.wallet.keyring.createFromPrivateKey(sellerPrivateKey);

  if (!caver.wallet.getKeyring(keyring.address)) {
    const singleKeyRing =
      caver.wallet.keyring.createFromPrivateKey(sellerPrivateKey);
    caver.wallet.add(singleKeyRing);
  }

  let kip17 = await caver.kct.kip17.deploy(
    {
      name: "Animal NFT Test",
      symbol: "Animal NFT Test",
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
        "0x2885c149c8a3044ce3568f3a127e58dfca3b43c2",
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

  res.send(mintResult, 200);
  console.log("end of /character post");
});

module.exports = router;