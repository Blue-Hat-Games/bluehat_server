module.exports = function (sequelize, DataTypes) {
    const user = sequelize.define(
        "user",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            login_type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            coin: {
                type: DataTypes.BIGINT,
                allowNull: false,
                default: 0,
            },
        },
        {
            sequelize,
            tableName: "user",
            timestamps: false,
        }
    );
    user.associate = (models) => {
        user.hasMany(models.animal_possession, {
            foreignKey: "user_id",
            sourceKey: "id",
        });
    };
    return user;
};