import express from "express";
import {
  getProfile,
  login,
  registerUser,
  updateProfile,
  logout,
} from "../controllers/auth.controller.js";
import verifyAuth from "../middleware/auth.midleware.js";

const route = express.Router();

route.post("/register", registerUser);
route.post("/login", login);
route.post("/logout", logout);
route.get("/profile", verifyAuth, getProfile);
route.put("/profile", verifyAuth, updateProfile);

export default route;
