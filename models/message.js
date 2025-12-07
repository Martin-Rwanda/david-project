export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Message",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.BIGINT },
      sender: { type: DataTypes.ENUM("user", "bot") },
      content: { type: DataTypes.TEXT, allowNull: false },
      type: { type: DataTypes.ENUM("text", "info"), defaultValue: "text" },
    },
    { tableName: "messages", timestamps: true, underscored: true }
  );
};
