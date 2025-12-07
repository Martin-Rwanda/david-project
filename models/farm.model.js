export default (sequelize, DataTypes) => {
  return sequelize.define(
    "FarmTransaction",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      cropActivity: { type: DataTypes.STRING(255), field: "crop_activity", allowNull: false },
      type: { type: DataTypes.ENUM("Income", "Expense"), allowNull: false },
      amount: { type: DataTypes.DOUBLE, allowNull: false },
      paymentMethod: { type: DataTypes.ENUM("Cash", "Mobile money", "Bank"), field: "payment_method", allowNull: false },
      description: { type: DataTypes.TEXT },
      created_by: { type: DataTypes.BIGINT },
    },
    { tableName: "farm_transactions", timestamps: true, underscored: true }
  );
};
