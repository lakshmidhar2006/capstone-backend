import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import sleep from 'sleep-promise';

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const retryRequest = async (fn, retries = 3, delay = 58 * 1000) => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (error.status === 429) {
        const backoffDelay = delay * Math.pow(2, i);
        console.log(`Rate limit exceeded, retrying in ${backoffDelay / 1000} seconds...`);
        await sleep(backoffDelay);
      } else {
        throw error;
      }
    }
  }
  throw lastError;
};

router.post("/autocomplete", async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await retryRequest(() => model.generateContent({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    }));

    res.json({ suggestion: result.text.trim() });

  } catch (error) {
    console.error("Gemini API Error:", error?.response?.data || error.message || error);
    res.status(500).json({ error: "Gemini API Error" });
  }
});

export default router;
