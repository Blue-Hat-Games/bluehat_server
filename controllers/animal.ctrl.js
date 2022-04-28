const models = require("../models");

exports.getUserAnimal = function (req, res, next) {
	// DB에서 유저가 가진 모든 동물 조회후 반환
	let userId = req.params.id;
	let animals = ["Rabbit"];
	return res.status(200).send(animals);
};

exports.getNewAnimal = async function (req, res, next) {
	try {
		// 새로운 동물 생성
		const allAnimalLength = await models.animal.count();
		let animalPickIndex = Math.floor(Math.random() * allAnimalLength + 1);
		let animal = await models.animal.findOne({ where: { id: animalPickIndex } });

		await models.animal_possession
			.create({
				nft_hash: "0",
				color: null,
				name: "testAnimal",
				tier: 1,
				user_id: req.body.userId,
				animal_id: animal.id,
			})
			.then((user) => {
				console.log(user);
			});

		return res.status(201).send(animal);
	} catch (e) {
		console.log(e);
		return res.status(500).send("Internal Server Error");
	}
};
