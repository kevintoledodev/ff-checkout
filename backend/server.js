import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import QRCode from "qrcode";

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 SUA API KEY E USER_ID FIXO
const API_KEY = process.env.API_KEY || "b20fce18053f855d865a267a7d3a9c24";
const USER_ID = process.env.USER_ID || "5747371591";

// ===============================
// 1) CRIAR PIX
// ===============================
app.post("/api/create-pix", async (req, res) => {
  try {
    const { value, user_id, cpf } = req.body;

    const url = `https://easy-pix.com/createPix?apiKey=${API_KEY}&value=${value}&user_id=${user_id}&cpf=${cpf}`;
    const r = await fetch(url);
    const data = await r.json();

    if (!data.pixId || !data.code) {
      return res.status(400).json({ error: "PIX inválido" });
    }

    // GERAR QR NO SERVIDOR
    const qrBase = await QRCode.toDataURL(data.code);

    res.json({
      pixId: data.pixId,
      code: data.code,
      qr: qrBase
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar PIX" });
  }
});

// ===============================
// 2) CONSULTAR PIX
// ===============================
app.get("/api/check-pix/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const url = `https://easy-pix.com/pix/${id}?apiKey=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao consultar PIX" });
  }
});

// Exporta o servidor para a Vercel tratar
export default app;
  // ===============================
  app.listen(3001, "0.0.0.0", () =>
  console.log("🔥 API rodando na rede")
);
