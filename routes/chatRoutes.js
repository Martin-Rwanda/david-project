import express from "express";
import db from "../models/index.js";
import { getBotReply } from "../services/openrouterService.js";

const { User, Message } = db;

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, content } = req.body;

  if (!email || !content?.trim()) {
    return res.status(400).json({ error: "Email and message content are required." });
  }

  try {
    // 🔍 Check user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // 💬 Save the user's message
    const userMessage = await Message.create({
      user_id: user.id,
      sender: "user",
      content: content.trim(),
    });

    // 🤖 Get AI bot reply
    const botReply = await getBotReply(content);

    // 💬 Save bot's message
    const botMessage = await Message.create({
      user_id: user.id,
      sender: "bot",
      content: botReply,
    });

    res.status(200).json({ message: botReply });

  } catch (err) {
    console.error("❌ Chat error:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

export default router;