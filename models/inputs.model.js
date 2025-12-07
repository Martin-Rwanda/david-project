export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Input",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      inputDate: { type: DataTypes.DATE, field: "input_date", defaultValue: DataTypes.NOW },
      name: { type: DataTypes.STRING(255), allowNull: false },
      amount: { type: DataTypes.DOUBLE, allowNull: false },
      description: { type: DataTypes.TEXT },
      created_by: { type: DataTypes.BIGINT },
    },
    { tableName: "inputs", timestamps: true, underscored: true }
  );
};