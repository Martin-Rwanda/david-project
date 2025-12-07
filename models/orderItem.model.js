export default (sequelize, DataTypes) => {
  return sequelize.define(
    "OrderItem",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      order_id: { type: DataTypes.BIGINT },
      product_id: { type: DataTypes.BIGINT },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      creator_user_id: { type: DataTypes.BIGINT },
      creator_user_name: { type: DataTypes.STRING(255) },
      creator_email: { type: DataTypes.STRING(255) },
      creator_phone: { type: DataTypes.STRING(255) },
      creator_address_district: { type: DataTypes.STRING(255) },
      creator_address_sector: { type: DataTypes.STRING(255) },
      creator_address_cell: { type: DataTypes.STRING(255) },
      creator_address_village: { type: DataTypes.STRING(255) },
      product_name: { type: DataTypes.STRING(255) },
      product_price: { type: DataTypes.DOUBLE },
      product_unit: { type: DataTypes.STRING(255) },
      product_image: { type: DataTypes.STRING(255) },
    },
    { tableName: "order_items", timestamps: true, underscored: true }
  );
};