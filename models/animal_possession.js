module.exports = function (sequelize, DataTypes) {
	const animal_possession = sequelize.define(
		"animal_possession",
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			nft_hash: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			color: {
				type: DataTypes.STRING(1023),
				allowNull: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			tier: {
				type: DataTypes.TINYINT,
				allowNull: false,
			},
			ipfs_addr: {
				type: DataTypes.STRING,
				allowNull: true,
			}
		},
		{
			sequelize,
			tableName: "animal_possession",
			timestamps: true,
		});
	animal_possession.associate = (models) => {
		animal_possession.belongsTo(models.user, {
			foreignKey: "user_id",
			targetKey: "id",
			onDelete: 'cascade',
			allowNull: false,
		})
		animal_possession.belongsTo(models.animal, {
			foreignKey: "animal_type",
			targetKey: "id",
			allowNull: false
		})
		animal_possession.belongsTo(models.head_item, {
			foreignKey: "head_item_id",
			targetKey: "id"
		})
		animal_possession.belongsTo(models.pattern, {
			foreignKey: "pattern_id",
			targetKey: "id"
		})
		animal_possession.hasMany(models.market, {
			foreignKey: "animal_possession_id",
			sourceKey: "id",
		});
	}
	return animal_possession;
};
