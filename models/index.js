import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    dialect: "mysql",
    logging: false,
    define: {
      underscored: true, 
      timestamps: true,
    },
  }
);

const db = { sequelize, DataTypes };

// import models
db.User = (await import("./auth.model.js")).default(sequelize, DataTypes);
db.CropPlan = (await import("./crop.model.js")).default(sequelize, DataTypes);
db.FarmTransaction = (await import("./farm.model.js")).default(sequelize, DataTypes);
db.Harvest = (await import("./harvest.model.js")).default(sequelize, DataTypes);
db.Input = (await import("./inputs.model.js")).default(sequelize, DataTypes);
db.Message = (await import("./message.js")).default(sequelize, DataTypes);
db.Role = (await import("./role.model.js")).default(sequelize, DataTypes);
db.Order = (await import("./order.model.js")).default(sequelize, DataTypes);
db.OrderItem = (await import("./orderItem.model.js")).default(sequelize, DataTypes);

// Ass
db.User.hasMany(db.CropPlan, { foreignKey: "created_by", as: "cropPlans" });
db.CropPlan.belongsTo(db.User, { foreignKey: "created_by", as: "createdBy" });

db.User.hasMany(db.FarmTransaction, { foreignKey: "created_by", as: "transactions" });
db.FarmTransaction.belongsTo(db.User, { foreignKey: "created_by", as: "createdBy" });

db.User.hasMany(db.Harvest, { foreignKey: "created_by", as: "harvests" });
db.Harvest.belongsTo(db.User, { foreignKey: "created_by", as: "createdBy" });
db.Harvest.belongsTo(db.CropPlan, { foreignKey: "crop_plan_id", as: "cropPlan" });

db.User.hasMany(db.Input, { foreignKey: "created_by", as: "inputs" });
db.Input.belongsTo(db.User, { foreignKey: "created_by", as: "createdBy" });

db.User.hasMany(db.Message, { foreignKey: "user_id", as: "messages" });
db.Message.belongsTo(db.User, { foreignKey: "user_id", as: "user" });

db.User.hasMany(db.Order, { foreignKey: "user_id", as: "orders" });
db.Order.belongsTo(db.User, { foreignKey: "user_id", as: "user" });

db.Order.hasMany(db.OrderItem, { foreignKey: "order_id", as: "items" });
db.OrderItem.belongsTo(db.Order, { foreignKey: "order_id", as: "order" });

db.User.hasMany(db.OrderItem, { foreignKey: "creator_user_id", as: "createdOrderItems" });
db.OrderItem.belongsTo(db.User, { foreignKey: "creator_user_id", as: "creatorUser" });

export default db;