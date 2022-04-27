exports.getUserAnimal = function (req, res, next) {
  // DB에서 유저가 가진 모든 동물 조회후 반환
  let userId = req.params.id;
  let animals = ["Rabbit"];
  return res.status(200).send(animals);
};

exports.getNewAnimal = function (req, res, next) {
  // 새로운 동물 생성
  const animals = [
    "ArcticFox",
    "Ox",
    "Penguin",
    "PolarBear",
    "Reindeer",
    "SeaLion",
    "SnowOwl",
    "SnowWeasel",
    "Walrus",
    "Buffalo",
    "Chick",
    "Cow",
    "Donkey",
    "Duck",
    "Hen",
    "Pig",
    "Rooster",
    "Sheep",
    "Crow",
    "Eagle",
    "Fox",
    "Hog",
    "Hornbill",
    "Owl",
    "Raccoon",
    "Snake",
    "Wolf",
    "Cat",
    "Dog",
    "Dove",
    "Goldfish",
    "Mice",
    "Parrot",
    "Pigeon",
    "Rabbit",
    "Tortoise",
    "Cheetah",
    "Elephant",
    "Flamingo",
    "Gazelle",
    "Hippo",
    "Hyena",
    "Ostrich",
    "Rhino",
    "Zebra",
    "Husky",
  ];
  let animalPickIndex = Math.floor(Math.random() * animals.length);
  let animal = animals[animalPickIndex];
  // DB에 새로운 동물 추가
  return res.status(201).send(animal);
};
