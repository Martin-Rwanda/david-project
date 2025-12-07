export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Order",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.BIGINT },
      totalAmount: { type: DataTypes.DOUBLE, field: "total_amount", allowNull: false },
      orderNumber: { type: DataTypes.STRING(255), unique: true, field: "order_number", allowNull: false },
      deliveryDistrict: { type: DataTypes.STRING(255), field: "delivery_district" },
      deliverySector: { type: DataTypes.STRING(255), field: "delivery_sector" },
      deliveryCell: { type: DataTypes.STRING(255), field: "delivery_cell" },
      deliveryVillage: { type: DataTypes.STRING(255), field: "delivery_village" },
      status: { type: DataTypes.ENUM("pending","confirmed","shipped","delivered","cancelled"), defaultValue: "pending" },
      paymentMethod: { type: DataTypes.STRING(50), field: "payment_method", defaultValue: "COD" },
    },
    { tableName: "orders", timestamps: true, underscored: true }
  );
};