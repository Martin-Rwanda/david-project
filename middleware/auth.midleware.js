import jwt from "jsonwebtoken";
import db from "../models/index.js"; 
const { User } = db;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.session;
    if (!token) return res.status(401).json({ message: "Not Authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const protect = verifyToken;
export default verifyToken;