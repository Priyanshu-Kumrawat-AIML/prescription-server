import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OLLAMA_HOST = "http://69.62.76.171:11434/api/generate";
const MODEL = "mistral:instruct";

app.post("/generate", async (req, res) => {
  const { patientName, age, symptoms } = req.body;
  const prompt = `Patient Name: ${patientName}\nAge: ${age}\nSymptoms: ${symptoms}\n...`;
  const response = await fetch(OLLAMA_HOST, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({model:MODEL,prompt,stream:false})});
  const data = await response.json();
  res.json({ response: data.response });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
