module.exports = function (sequelize, DataTypes) {
	const animal = sequelize.define(
		"animal",
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "animal",
			timestamps: false,
		}
	);
	animal.associate = (models) => {
		animal.hasMany(models.animal_possession, {
			foreignKey: "animal_type",
			sourceKey: "id"
		});
	}
	return animal;
};