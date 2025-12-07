import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import db from "./models/index.js"; 

import authRoutes from "./routes/authRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import harvestRoutes from "./routes/harvestRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from './routes/roleRoutes.js';
import chatRoute from "./routes/chatRoutes.js";
import farmTransactionRoutes from './routes/farm.routes.js';
import inputsRoutes from './routes/inputsRoutes.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const { sequelize } = db;

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize connected to SQL database successfully.");
    await sequelize.sync({ alter: true }); 
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

await connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/harvest", harvestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/chat", chatRoute);
app.use("/api/transactions", farmTransactionRoutes);
app.use("/api/inputs", inputsRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});