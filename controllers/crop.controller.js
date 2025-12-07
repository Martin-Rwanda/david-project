import db from "../models/index.js";
const { CropPlan, User } = db;

export const getCropPlans = async (req, res) => {
  try {
    const crops = await CropPlan.findAll({
      include: [{ model: User, as: "createdBy", attributes: ["id", "userName", "email"] }],
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ success: true, data: crops });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCropPlan = async (req, res) => {
  try {
    const crop = await CropPlan.findByPk(req.params.id, {
      include: [{ model: User, as: "createdBy", attributes: ["id", "userName", "email"] }],
    });
    if (!crop) return res.status(404).json({ message: "Crop plan not found" });
    res.status(200).json({ success: true, data: crop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createCropPlan = async (req, res) => {
  try {
    const { cropName, variety, fieldArea, plantingDate, expectedHarvestDate, expectedYield, cost, notes } = req.body;
    const newCrop = await CropPlan.create({
      cropName,
      variety,
      fieldArea,
      plantingDate,
      expectedHarvestDate,
      expectedYield,
      cost: cost || 0,
      notes,
      created_by: req.user.id,
    });
    const populatedCrop = await CropPlan.findByPk(newCrop.id, {
      include: [{ model: User, as: "createdBy", attributes: ["id", "userName", "email"] }],
    });
    res.status(201).json({ success: true, message: "Crop plan created successfully", data: populatedCrop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCropPlan = async (req, res) => {
  try {
    const crop = await CropPlan.findByPk(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop plan not found" });

    await CropPlan.update(req.body, { where: { id: req.params.id } });
    const updatedCrop = await CropPlan.findByPk(req.params.id, {
      include: [{ model: User, as: "createdBy", attributes: ["id", "userName", "email"] }],
    });
    res.status(200).json({ success: true, message: "Crop plan updated successfully", data: updatedCrop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCropPlan = async (req, res) => {
  try {
    const crop = await CropPlan.findByPk(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop plan not found" });
    await CropPlan.destroy({ where: { id: req.params.id } });
    res.status(200).json({ success: true, message: "Crop plan deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};