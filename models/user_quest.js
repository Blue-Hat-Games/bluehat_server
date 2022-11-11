module.exports = function (sequelize, DataTypes) {
    const user_quest = sequelize.define(
        "user_quest",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            status: {
                type: DataTypes.Boolean,
                allowNull: false,
            },
            get_reward: {
                type: DataTypes.Boolean,
                allowNull: false,
            }
        },
        {
            sequelize,
            tableName: "user_quest",
            timestamps: true,
        }
    );
    user_quest.associate = (models) => {
        user_quest.belongTo(models.user, {
            foreignKey: "user_id",
            targetKey: "id"
        })
        user_quest.belongTo(models.quest, {
            foreignKey: "quest_id",
            targetKey: "id"
        })
    };
    return user_quest;
};