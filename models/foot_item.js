module.exports = function (sequelize, DataTypes) {
    const foot_item = sequelize.define(
        "foot_item",
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
            tableName: "foot_item",
            timestamps: false,
        }
    );
    foot_item.associate = (models) => {
        foot_item.hasMany(models.animal_possession, {
            foreignKey: "foot_item_id",
            sourceKey: "id",
        });
    };
    return foot_item;
};