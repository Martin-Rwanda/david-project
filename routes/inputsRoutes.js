import express from "express";
import {
  getInputs,
  createInput,
  updateInput,
} from "../controllers/inputs.controller.js";
import { protect } from "../middleware/auth.midleware.js";

const router = express.Router();

router.use(protect);

// Routes
router.get("/", getInputs);
router.post("/", createInput);
router.put("/:id", updateInput);

export default router;
