export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Role",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(255), unique: true, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      permissions: { type: DataTypes.JSON, allowNull: false },
      userCount: { type: DataTypes.INTEGER, defaultValue: 0, field: "user_count" },
      isSystem: { type: DataTypes.BOOLEAN, defaultValue: false, field: "is_system" },
    },
    { tableName: "roles", timestamps: true, underscored: true }
  );
};