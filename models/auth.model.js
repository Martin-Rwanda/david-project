import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    userName: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    role : {
      type: String,
      default : "client",
    },
    address: {
      district: String,
      sector: String,
      cell: String,
      village: String,
    },
    Status : {
      type: String,
      default : "Active",
    },
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite during hot reloads
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
