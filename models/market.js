module.exports = function (sequelize, DataTypes) {
    const market = sequelize.define(
        "market",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            seller_private_key:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            token_id:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            contract_address:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            view_count:{
                type: DataTypes.INTEGER,
                allowNull: false,
                default: 0,
            }
        },
        {
            sequelize,
            tableName: "market",
            timestamps: true,
        }
    );
    market.associate = (models) => {
        market.belongsTo(models.user, {
            foreignKey: "user_id",
            targetKey: "id"
        })
        market.belongsTo(models.animal_possession, {
            foreignKey: "animal_possession_id",
            targetKey: "id"
        })
    };
    return market;
};