module.exports = function (sequelize, DataTypes) {
    const nft = sequelize.define(
        "nft",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            token_id: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            ipfs_addr: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            contract_addr: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            sequelize,
            tableName: "nft",
            timestamps: true,
        }
    );
    nft.associate = (models) => {
        nft.hasMany(models.animal_possession, {
            foreignKey: "nft_id",
            sourceKey: "id",
        });
    };
    return nft;
};