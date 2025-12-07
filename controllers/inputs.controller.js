import db from "../models/index.js";
const { Input, User } = db;

export const createInput = async (req, res) => {
  try {
    const { name, amount, inputDate = new Date(), description } = req.body;
    const newInput = await Input.create({ name, amount, input_date: inputDate, description, created_by: req.user.id });
    const populatedInput = await Input.findByPk(newInput.id, { include: [{ model: User, as: "createdBy", attributes: ["id", "userName", "email"] }] });
    res.status(201).json({ success: true, message: "Input added successfully", data: populatedInput });
  } catch (error) {
    console.error("Error in createInput:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getInputs = async (req, res) => {
  try {
    const inputs = await Input.findAll({ include: [{ model: User, as: "createdBy", attributes: ["id", "userName", "email"] }] });
    res.status(200).json({ success: true, data: inputs });
  } catch (error) {
    console.error("Error in getInputs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateInput = async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedCount] = await Input.update(req.body, { where: { id } });
    if (!updatedCount) return res.status(404).json({ message: "Input not found" });
    const updated = await Input.findByPk(id, { include: [{ model: User, as: "createdBy", attributes: ["id", "userName", "email"] }] });
    res.status(200).json({ success: true, message: "Input updated successfully", data: updated });
  } catch (error) {
    console.error("Error in updateInput:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};