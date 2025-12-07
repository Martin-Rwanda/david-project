export default (sequelize, DataTypes) => {
  return sequelize.define(
    "CropPlan",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      cropName: { type: DataTypes.STRING(255), field: "crop_name" },
      variety: { type: DataTypes.STRING(255) },
      fieldArea: { type: DataTypes.DOUBLE, field: "field_area" },
      plantingDate: { type: DataTypes.DATEONLY, field: "planting_date" },
      expectedHarvestDate: { type: DataTypes.DATEONLY, field: "expected_harvest_date" },
      status: {
        type: DataTypes.ENUM("planned", "planted", "growing", "harvested"),
        defaultValue: "planned",
      },
      expectedYield: { type: DataTypes.DOUBLE, field: "expected_yield", allowNull: false },
      cost: { type: DataTypes.DOUBLE, defaultValue: 0 },
      notes: { type: DataTypes.TEXT },
      created_by: { type: DataTypes.BIGINT }, // FK
    },
    { tableName: "crop_plans", timestamps: true, underscored: true }
  );
};
