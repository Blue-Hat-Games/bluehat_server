module.exports = function (sequelize, DataTypes) {
    const quest_reward = sequelize.define(
        "quest_reward",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            egg: {
                type: DataTypes.INTEGER,
                allowNull: false,
                default: 0,
            },
            coin: {
                type: DataTypes.INTEGER,
                allowNull: false,
                default: 0,
            }
        },
        {
            sequelize,
            tableName: "quest_reward",
            timestamps: true,
        }
    );
    quest_reward.associate = (models) => {
        quest_reward.hasMany(models.quest, {
            foreignKey: "reward_id",
            sourceKey: "id",
        });
    };
    return quest_reward;
};