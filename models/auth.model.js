export default (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      userName: { type: DataTypes.STRING(255), field: "user_name" },
      email: { type: DataTypes.STRING(255), unique: true, allowNull: true },
      password: { type: DataTypes.STRING(255) },
      phone: { type: DataTypes.STRING(50) },
      role: { type: DataTypes.STRING(50), defaultValue: "client" },
      addressDistrict: { type: DataTypes.STRING(255), field: "address_district" },
      addressSector: { type: DataTypes.STRING(255), field: "address_sector" },
      addressCell: { type: DataTypes.STRING(255), field: "address_cell" },
      addressVillage: { type: DataTypes.STRING(255), field: "address_village" },
      status: { type: DataTypes.STRING(50), defaultValue: "Active" },
      otp: { type: DataTypes.STRING(255) },
      otpExpires: { type: DataTypes.DATE, field: "otp_expires" },
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true,
    }
  );
};
