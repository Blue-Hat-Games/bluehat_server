const { truncate } = require("fs");

module.exports = function (sequelize, DataTypes) {
	const user = sequelize.define(
		"user",
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			login_type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			wallet_address: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			coin: {
				type: DataTypes.BIGINT,
				allowNull: false,
				default: 0,
			},
			egg: {
				type: DataTypes.BIGINT,
				allowNull: false,
				default: 0,
			},
			deleted: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				default: false
			},
		},
		{
			sequelize,
			tableName: "user",
			timestamps: true,
		}
	);
	user.associate = (models) => {
		user.hasMany(models.animal_possession, {
			foreignKey: "user_id",
			sourceKey: "id",
			onDelete: 'cascade',
			allowNull: false,
		});
		user.hasMany(models.market, {
			foreignKey: "user_id",
			sourceKey: "id",
			onDelete: 'cascade',
			allowNull: false,
		});
	};
	return user;
};