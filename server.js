import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// For ES modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// Parse JSON
app.use(express.json());

// Enable CORS for API requests
app.use(cors());

// Your Ollama server
const OLLAMA_HOST = "http://69.62.76.171:11434/api/generate";

// Proxy API route
app.post("/api/generate", async (req, res) => {
  try {
    const response = await fetch(OLLAMA_HOST, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy Error:", err.message);
    res.status(500).json({ error: "Proxy request failed" });
  }
});

// Catch-all: serve index.html for frontend routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
