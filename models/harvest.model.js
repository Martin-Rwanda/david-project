export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Harvest",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      crop_plan_id: { type: DataTypes.BIGINT },
      cropName: { type: DataTypes.STRING(255), field: "crop_name", allowNull: false },
      harvestDate: { type: DataTypes.DATEONLY, field: "harvest_date", allowNull: false },
      actualYield: { type: DataTypes.DOUBLE, field: "actual_yield", allowNull: false },
      quality: { type: DataTypes.STRING(255), allowNull: false },
      marketPrice: { type: DataTypes.DOUBLE, field: "market_price", allowNull: false },
      totalRevenue: { type: DataTypes.DOUBLE, field: "total_revenue", allowNull: false },
      storageLocation: { type: DataTypes.STRING(255), field: "storage_location" },
      notes: { type: DataTypes.TEXT },
      created_by: { type: DataTypes.BIGINT },
    },
    { tableName: "harvests", timestamps: true, underscored: true }
  );
};
