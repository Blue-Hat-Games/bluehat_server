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
                type: DataTypes.STRING.BINARY,
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
        },
        {
            sequelize,
            tableName: "animal_possession",
            timestamps: false,
        });
    animal_possession.associate = (models) => {
        animal_possession.belongsTo(models.user, {
            foreignKey: "user_id",
            targetKey: "id"
        })
        animal_possession.belongsTo(models.animal, {
            foreignKey: "animal_id",
            targetKey: "id"
        })
        animal_possession.belongsTo(models.head_item, {
            foreignKey: "head_item_id",
            targetKey: "id"
        })
        animal_possession.belongsTo(models.body_item, {
            foreignKey: "body_item_id",
            targetKey: "id"
        })
        animal_possession.belongsTo(models.foot_item, {
            foreignKey: "foot_item_id",
            targetKey: "id"
        })
        animal_possession.belongsTo(models.pattern, {
            foreignKey: "pattern_id",
            targetKey: "id"
        })
    }
    return animal_possession;
};
