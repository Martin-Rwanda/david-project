import db from "../models/index.js";
import bcrypt from "bcryptjs";
const { User } = db;
import { Op } from "sequelize";

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;
    const skip = (page - 1) * limit;
    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { userName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const users = await User.findAll({
      where,
      attributes: { exclude: ["password"] },
      offset: parseInt(skip),
      limit: parseInt(limit),
      order: [["created_at", "DESC"]],
    });

    const total = await User.count({ where });
    res.json({ users, pagination: { current: parseInt(page), pages: Math.ceil(total / limit), total } });
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ["password"] } });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { userName, email, password, role, status, phone, addressDistrict, addressSector, addressCell, addressVillage } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ userName, email, password: hashedPassword, role, status, phone, addressDistrict, addressSector, addressCell, addressVillage });

    const userResponse = user.get({ plain: true });
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    if (password) updateData.password = await bcrypt.hash(password, 12);

    const [updatedCount] = await User.update(updateData, { where: { id: req.params.id } });
    if (!updatedCount) return res.status(404).json({ message: "User not found" });

    const user = await User.findByPk(req.params.id, { attributes: { exclude: ["password"] } });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const roleStats = await User.findAll({
      attributes: ["role", [db.Sequelize.fn("COUNT", db.Sequelize.col("role")), "count"]],
      group: ["role"],
      raw: true,
    });

    const statusStats = await User.findAll({
      attributes: ["status", [db.Sequelize.fn("COUNT", db.Sequelize.col("status")), "count"]],
      group: ["status"],
      raw: true,
    });

    const total = await User.count();
    const recentUsers = await User.count({ where: { created_at: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } });

    res.json({ total, recentUsers, roleStats, statusStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
