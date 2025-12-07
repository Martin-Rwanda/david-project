import db from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { User } = db;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
}

export const registerUser = async (req, res) => {
  const { userName, email, password, phone, addressDistrict, addressSector, addressCell, addressVillage, role } = req.body;
  try {
    if (!userName || !email || !password) {
      return res.status(400).json({ success: false, message: "userName, email and password are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already in use!" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
      phone,
      addressDistrict,
      addressSector,
      addressCell,
      addressVillage,
      role: role || "client",
    });

    const token = generateToken({ id: newUser.id });
    res.cookie("session", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "Your account was successfully created!",
      user: {
        id: newUser.id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.error("registerUser error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ message: "All Fields Are required!" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Double Check Your Password And Try Again!" });

    const token = generateToken({ id: user.id, role: user.role });
    res.cookie("session", token, cookieOptions);

    const userResponse = {
      id: user.id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
    };

    return res.status(200).json({ success: true, token, user: userResponse });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      id: user.id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      status: user.status,
      addressDistrict: user.addressDistrict,
      addressSector: user.addressSector,
      addressCell: user.addressCell,
      addressVillage: user.addressVillage,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userName, email, phone, addressDistrict, addressSector, addressCell, addressVillage } = req.body;

    if (email) {
      const existingUser = await User.findOne({ where: { email, id: { [db.Sequelize.Op.ne]: req.user.id } } });
      if (existingUser) return res.status(400).json({ message: "Email already in use" });
    }

    const [_, [updatedUser]] = await User.update(
      { userName, email, phone, addressDistrict, addressSector, addressCell, addressVillage },
      { where: { id: req.user.id }, returning: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    const userObj = updatedUser.get({ plain: true });
    delete userObj.password;

    res.status(200).json({ success: true, message: "Profile updated successfully", user: userObj });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("session");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("logout error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};