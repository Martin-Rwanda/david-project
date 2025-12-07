// routes/chat.js
import express from "express";
import Message from "../models/Message.js";
import User from "../models/auth.model.js";
import { getBotReply } from "../services/openrouterService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, content } = req.body;

  if (!email || !content?.trim()) {
    return res.status(400).json({ error: "Email and message content are required." });
  }

  try {
    // 🔍 Check or create user
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // 💬 Save user message
    const userMessage = new Message({
      user: user._id,
      sender: "user",
      content: content.trim(),
    });
    await userMessage.save();

    // 🤖 Get bot reply
    const botReply = await getBotReply(content);

    // 💬 Save bot message
    const botMessage = new Message({
      user: user._id,
      sender: "bot",
      content: botReply,
    });
    await botMessage.save();

    res.json({ message: botReply });
  } catch (err) {
    console.error("❌ Chat error:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

export default router;
