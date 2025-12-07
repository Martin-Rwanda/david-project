import db from "../models/index.js";
const { Role } = db;
import { Op } from "sequelize";

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const existingRole = await Role.findByPk(id);
    if (!existingRole) return res.status(404).json({ success: false, message: "Role not found" });

    const updateData = {
      name: req.body.name ?? existingRole.name,
      description: req.body.description ?? existingRole.description,
      permissions: req.body.permissions ?? existingRole.permissions,
    };

    const [_, [updatedRole]] = await Role.update(updateData, { where: { id }, returning: true });
    res.status(200).json({ success: true, data: updatedRole, message: "Role updated successfully" });
  } catch (err) {
    console.error("Update Role Error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to update role" });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });
    if (role.userCount > 0) return res.status(400).json({ success: false, message: "Cannot delete role with assigned users" });
    await Role.destroy({ where: { id } });
    res.status(200).json({ success: true, message: "Role deleted successfully" });
  } catch (err) {
    console.error("Delete Role Error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to delete role" });
  }
};
