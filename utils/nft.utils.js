const fs = require("fs");
var express = require("express");
var router = express.Router();
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('ipfs-api', '5001', { protocol: 'http' })
var axios = require('axios');

// Default Acess Key Setting
const config = require("./config");
const accessKeyId = config.accessKeyId;
const secretAccessKey = config.secretAccessKey;
const authorization = config.authorization;
const sellerPrivateKey = config.sellerPrivateKey;
const logger = require("../config/logger");
const { promisify } = require("util");
const { verify } = require("crypto");
const caver = config.caver;



var newID = function () {
	return Math.random().toString(36).substr(2, 16);
};


exports.getNft = async function (title, symbol, tokenURI, toAddr) {
	try {
		const keyring = caver.wallet.keyring.createFromKlaytnWalletKey(sellerPrivateKey);

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

		contractAddr = kip17.options.address;
		kip17 = new caver.kct.kip17(contractAddr);
		minted = false;
		while (true) {
			randomID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
			try {
				owner = await kip17.ownerOf(randomID);
			} catch (e) {
				mintResult = await kip17.mintWithTokenURI(
					toAddr,
					randomID,
					tokenURI,
					{ from: keyring.address }
				);

				minted = true;
			}
			if (minted) {
				break;
			}
		}
	} catch (e) {
		logger.error(e)
		return "err";
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
		if (transferResult === null) {
			throw new Error("transfer failed")
		}
		else {
			logger.info('transferResult', transferResult);
			return transferResult;
		}
	}
	catch (e) {
		logger.error(e)
		logger.info(`${req.method} ${req.originalUrl}`);
		return "err";
	}

};

exports.uploadIpfsImg = async function (img) {
	const addFile = promisify(ipfs.files.add);
	const filehash = await addFile(img.buffer);
	return filehash[0].hash;
}

exports.uploadIpfsMeta = async function (imgHash) {
	const addFile = promisify(ipfs.files.add);
	json_result = JSON.stringify({
		"image": "ipfs://" + imgHash,
		"description": "The bluehat animals are unique and randomly generated Bluehat. Not only that, Welcome to join us the bluehat society.",
		"name": "Bluehat Animal",
		"attributes": []
	});
	const json_file_hash = await addFile(Buffer.from(json_result));
	return "ipfs://" + json_file_hash[0].hash;
}

exports.getKeyring = async function () {
	// create new Keyring
	const keyring = caver.wallet.keyring.generate()
	if (keyring) {
		const result = {
			"address": keyring._address,
			"privateKey": keyring._key._privateKey,
			"klaytnWalletKey": keyring._key._privateKey + "0x00" + keyring._address
		}
		return result
	}
	else {
		new Error("Can't Create New Addr")
	}
}

exports.faucetKlay = function (address) {
	// faucet 150 klay
	var config = {
		method: 'post',
		url: 'https://api-baobab.wallet.klaytn.com/faucet/run?address=' + address,
		headers: {}
	};

	axios(config)
		.then(function (response) {
			console.log(JSON.stringify(response.data));
		})
		.catch(function (error) {
			console.log(error);
		});
}