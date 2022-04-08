module.exports = function (sequelize, DataTypes) {
    const pattern = sequelize.define(
        "pattern",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            filename: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "pattern",
            timestamps: false,
        }
    );
    pattern.associate = (models) => {
        pattern.hasMany(models.animal_possession, {
            foreignKey: "pattern_id",
            sourceKey: "id",
        });
    };
    return pattern;
};