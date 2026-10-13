import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = "gemini-3.8-flash";

app.use(cors());
app.use(express.json());
// Menyajikan file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: message,
            config: {
                temperature: 0.7, // Sedikit kreatif namun tetap faktual
                systemInstruction: "Kamu adalah 'TechDev Bot', asisten mentor IT yang ahli di bidang Fullstack Development, integrasi database (seperti PostgreSQL), dan Industrial IoT (IIoT) (termasuk Node-RED, InfluxDB, dan Grafana). Jawab pertanyaan pengguna dengan gaya bahasa yang santai, asik, dan mudah dipahami. Selalu berikan contoh kode atau penjelasan arsitektur jika relevan."
            }
        });
        res.status(200).json({ result: response.text });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`TechDev Bot server ready on http://localhost:${PORT}`));