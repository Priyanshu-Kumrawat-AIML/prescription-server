import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors()); // allow frontend to call
app.use(express.json());

const OLLAMA_HOST = "http://69.62.76.171:11434/api/generate";
const MODEL = "mistral:instruct";

app.post("/generate", async (req, res) => {
  const { patientName, age, symptoms } = req.body;

  const prompt = `
You are a medical AI that must always respond in strict prescription format.

Patient Name: ${patientName}
Age: ${age}
Symptoms: ${symptoms}

Medicines:
- <medicine 1>, <strength>, <dosage>
- <medicine 2>, <strength>, <dosage>

Advice:
- <point 1>
- <point 2>
- <point 3>
`;

  try {
    const response = await fetch(OLLAMA_HOST, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, prompt, stream: false })
    });

    const data = await response.json();
    res.json({ response: data.response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
