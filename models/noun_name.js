module.exports = function (sequelize, DataTypes) {
    const noun_name = sequelize.define(
        "noun_name",
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
            tableName: "noun_item",
            timestamps: false,
        }
    );
    return noun_name;
};