import userModel from "../models/auth.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateOtp, sendOtpEmail } from "../utils/otp.js";



export const registerUser = async (req, res) => {
  const { userName, email, password, phone, address, role } = req.body;

  try {
    if (!userName || !email || !password || !address) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await userModel.create({
      userName,
      email,
      password: hashedPassword,
      phone, 
      address,
      role: role || "client",
    });

    const token = generateToken(newUser._id);
    res.cookie("session", token, cookieOptions);

    return res.status(201).json({ 
      success: true,
      message: "Your account was successfully created!",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        phone: newUser.phone // Added phone to response
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for:", req.body);

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All Fields Are required!" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Double Check Your Password And Try Again!" });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      _id: req.user._id,
      userName: req.user.userName,
      email: req.user.email,
      role: req.user.role,
      status: req.user.status,
      address: req.user.address,
      phone: req.user.phone,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userName, email, phone, address } = req.body;
    
    if (email) {
      const existingUser = await userModel.findOne({ email, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      { userName, email, phone, address },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        userName: updatedUser.userName,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        status: updatedUser.status,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("session", {
      httpOnly: none,
      secure: false,
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
