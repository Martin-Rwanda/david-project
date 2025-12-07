import db from "../models/index.js";
const { Harvest, CropPlan, User, Sequelize } = db;
import { Op } from 'sequelize';

export const getHarvestRecords = async (req, res) => {
  try {
    const harvests = await Harvest.findAll({
      include: [
        { model: CropPlan, as: "cropPlan", attributes: ["id", "cropName", "variety", "fieldArea"] },
        { model: User, as: "createdBy", attributes: ["id", "userName", "email", "phone"] },
      ],
      order: [["harvest_date", "DESC"]],
    });
    res.status(200).json({ success: true, data: harvests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyHarvestRecords = async (req, res) => {
  try {
    const harvests = await Harvest.findAll({
      where: { created_by: req.user.id },
      include: [
        { model: CropPlan, as: "cropPlan", attributes: ["id", "cropName", "variety", "fieldArea"] },
        { model: User, as: "createdBy", attributes: ["id", "userName", "email"] },
      ],
      order: [["harvest_date", "DESC"]],
    });
    res.status(200).json({ success: true, data: harvests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getHarvestRecord = async (req, res) => {
  try {
    const harvest = await Harvest.findOne({
      where: { id: req.params.id, created_by: req.user.id },
      include: [
        { model: CropPlan, as: "cropPlan", attributes: ["id", "cropName", "variety", "fieldArea", "expected_yield"] },
        { model: User, as: "createdBy", attributes: ["id", "userName", "email"] },
      ],
    });
    if (!harvest) return res.status(404).json({ message: "Harvest record not found" });
    res.status(200).json({ success: true, data: harvest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createHarvestRecord = async (req, res) => {
  try {
    const { cropPlan: cropPlanId, harvestDate = new Date(), actualYield, quality, marketPrice, storageLocation, notes } = req.body;

    const cropPlanExists = await CropPlan.findOne({ where: { id: cropPlanId, created_by: req.user.id } });
    if (!cropPlanExists) return res.status(404).json({ message: "Crop plan not found or doesn't belong to you" });

    const totalRevenue = (actualYield || 0) * (marketPrice || 0);

    const newHarvest = await Harvest.create({
      crop_plan_id: cropPlanId,
      cropName: cropPlanExists.cropName,
      harvestDate,
      actualYield,
      quality,
      marketPrice,
      totalRevenue,
      storageLocation,
      notes,
      created_by: req.user.id,
    });

    await CropPlan.update({ status: "harvested", expected_harvest_date: harvestDate }, { where: { id: cropPlanId } });

    const populatedHarvest = await Harvest.findByPk(newHarvest.id, {
      include: [
        { model: CropPlan, as: "cropPlan", attributes: ["id", "cropName", "variety", "fieldArea", "expectedYield"] },
        { model: User, as: "createdBy", attributes: ["id", "userName", "email"] },
      ],
    });

    res.status(201).json({ success: true, message: "Harvest record created successfully", data: populatedHarvest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateHarvestRecord = async (req, res) => {
  try {
    const harvest = await Harvest.findOne({ where: { id: req.params.id, created_by: req.user.id } });
    if (!harvest) return res.status(404).json({ message: "Harvest record not found or you don't have permission" });

    const actualYield = req.body.actualYield !== undefined ? req.body.actualYield : harvest.actualYield;
    const marketPrice = req.body.marketPrice !== undefined ? req.body.marketPrice : harvest.marketPrice;
    req.body.totalRevenue = actualYield * marketPrice;

    await Harvest.update(req.body, { where: { id: req.params.id } });

    const updatedHarvest = await Harvest.findByPk(req.params.id, {
      include: [
        { model: CropPlan, as: "cropPlan", attributes: ["id", "cropName", "variety", "fieldArea", "expectedYield"] },
        { model: User, as: "createdBy", attributes: ["id", "userName", "email"] },
      ],
    });

    res.status(200).json({ success: true, message: "Harvest record updated successfully", data: updatedHarvest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteHarvestRecord = async (req, res) => {
  try {
    const harvest = await Harvest.findOne({ where: { id: req.params.id, created_by: req.user.id } });
    if (!harvest) return res.status(404).json({ message: "Harvest record not found or you don't have permission" });

    await Harvest.destroy({ where: { id: req.params.id } });
    await CropPlan.update({ status: "growing" }, { where: { id: harvest.crop_plan_id } });

    res.status(200).json({ success: true, message: "Harvest record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getHarvestStats = async (req, res) => {
  try {
    const totalHarvests = await Harvest.count({ where: { created_by: req.user.id } });

    const totals = await Harvest.findOne({
      attributes: [
        [db.Sequelize.fn("SUM", db.Sequelize.col("actual_yield")), "totalYield"],
        [db.Sequelize.fn("SUM", db.Sequelize.col("total_revenue")), "totalRevenue"],
      ],
      where: { created_by: req.user.id },
      raw: true,
    });

    const qualityDistribution = await Harvest.findAll({
      attributes: ["quality", [db.Sequelize.fn("COUNT", "*"), "count"]],
      where: { created_by: req.user.id },
      group: ["quality"],
      raw: true,
    });

    res.status(200).json({
      success: true,
      data: {
        totalHarvests,
        totalYield: Number(totals.totalYield) || 0,
        totalRevenue: Number(totals.totalRevenue) || 0,
        qualityDistribution,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};