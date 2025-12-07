import express from "express";
import {
  getCropPlans,
  getCropPlan,
  createCropPlan,
  updateCropPlan,
  deleteCropPlan,
} from "../controllers/crop.controller.js";
import { protect } from "../middleware/auth.midleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get("/", getCropPlans);
router.get("/:id", getCropPlan);
router.post("/", createCropPlan);
router.put("/:id", updateCropPlan);
router.delete("/:id", deleteCropPlan);

export default router;