module.exports = function (sequelize, DataTypes) {
    const adj_name = sequelize.define(
        "adj_name",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "adj_name",
            timestamps: false,
        }
    );
    return adj_name;
};