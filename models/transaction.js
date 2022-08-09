module.exports = function (sequelize, DataTypes) {
	const transaction = sequelize.define(
		"transaction",
		{
			id: {
				primaryKey: true,
				autoIncrement: true,
				type: DataTypes.INTEGER,
			},
			token_id: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: true,
			},
			transaction_hash: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			contract_address: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: "transaction",
			timestamps: true,
		}
	);
	return transaction;
};