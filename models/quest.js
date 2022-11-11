module.exports = function (sequelize, DataTypes) {
    const quest = sequelize.define(
        "quest",
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
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "quest",
            timestamps: true,
        }
    );
    quest.associate = (models) => {
        quest.hasMany(models.user_quest, {
            foreignKey: "quest_id",
            sourceKey: "id",
        });
        quest.belongTo(models.quest_reward, {
            foreignKey: "reward_id",
            targetKey: "id",
        });
    };
    return quest;
};