import express from "express";
import path from "path";
import { getMovieRecommendationsServer, summarizeChatServer, tagChatServer } from "./gemini";

const app = express();

app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", environment: process.env.NODE_ENV });
});

app.post("/api/recommendations", async (req, res) => {
  try {
    const { preferences } = req.body;
    const recs = await getMovieRecommendationsServer(preferences);
    res.json(recs);
  } catch (error) {
    console.error("Recommendations error:", error);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

app.post("/api/summarize", async (req, res) => {
  try {
    const { messages } = req.body;
    const summary = await summarizeChatServer(messages);
    res.json({ summary });
  } catch (error) {
    console.error("Summarize error:", error);
    res.status(500).json({ error: "Failed to summarize chat" });
  }
});

app.post("/api/tags", async (req, res) => {
  try {
    const { messages } = req.body;
    const tags = await tagChatServer(messages);
    res.json(tags);
  } catch (error) {
    console.error("Tags error:", error);
    res.status(500).json({ error: "Failed to get tags" });
  }
});

export default app;
