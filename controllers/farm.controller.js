import db from "../models/index.js";
const { FarmTransaction } = db;

export const createTransaction = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Authentication required" });
  try {
    const transactionData = { ...req.body, created_by: req.user.id };
    const transaction = await FarmTransaction.create(transactionData);
    return res.status(201).json(transaction);
  } catch (error) {
    console.error("createTransaction error:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await FarmTransaction.findAll({ where: { created_by: req.user.id } });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await FarmTransaction.findOne({ where: { id: req.params.id, created_by: req.user.id } });
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const [updatedCount] = await FarmTransaction.update(req.body, { where: { id: req.params.id, created_by: req.user.id } });
    if (!updatedCount) return res.status(404).json({ error: "Transaction not found" });
    const updated = await FarmTransaction.findByPk(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const deleted = await FarmTransaction.destroy({ where: { id: req.params.id, created_by: req.user.id } });
    if (!deleted) return res.status(404).json({ error: "Transaction not found" });
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
