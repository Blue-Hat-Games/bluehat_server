module.exports = function (sequelize, DataTypes) {
    const body_item = sequelize.define(
        "body_item",
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
            tableName: "body_item",
            timestamps: false,
        }
    );
    body_item.associate = (models) => {
        body_item.hasMany(models.animal_possession, {
            foreignKey: "body_item_id",
            sourceKey: "id",
        });
    };
    return body_item;
};