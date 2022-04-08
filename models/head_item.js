module.exports = function (sequelize, DataTypes) {
    const head_item = sequelize.define(
        "head_item",
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
            tableName: "head_item",
            timestamps: false,
        }
    );
    head_item.associate = (models) => {
        head_item.hasMany(models.animal_possession, {
            foreignKey: "head_item_id",
            sourceKey: "id",
        });
    };
    return head_item;
};