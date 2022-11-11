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
            action: {
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
            reward_egg: {
                type: DataTypes.INTEGER,
                allowNull: false,
                default: 0,
            },
            reward_coin: {
                type: DataTypes.INTEGER,
                allowNull: false,
                default: 0,
            }
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
    };
    return quest;
};