// services/openrouterService.js
import axios from "axios";

export async function getBotReply(message) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", 
        messages: [
          { role: "system", content: "You are an expert farming assistant. Help the user with clear and useful agricultural advice.And return plain text only" },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ OpenRouter API error:", error.message);
    throw new Error("Failed to get bot response.");
  }
}
