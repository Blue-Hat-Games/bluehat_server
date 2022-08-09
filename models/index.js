const Sequelize = require("sequelize");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const basename = path.basename(__filename);

const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    timezone: "+09:00", //한국 시간 세팅
    operatorsAliases: 0,
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    },
});

let db = [];

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;

module.exports = db;
