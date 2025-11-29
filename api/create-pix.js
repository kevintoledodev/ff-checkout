export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { value, name, email, document } = req.body;

    if (!value || !name || !email || !document) {
      return res.status(400).json({ error: "Campos inválidos" });
    }

    const CLIENT_ID = process.env.SYNC_CLIENT_ID;
    const CLIENT_SECRET = process.env.SYNC_CLIENT_SECRET;
    const API_BASE = process.env.SYNC_API_BASE || "https://api.syncpay.com.br";

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return res.status(500).json({ error: "Variáveis SyncPay ausentes" });
    }

    // 1) OBTER TOKEN
    const tokenRes = await fetch(`${API_BASE}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials"
      })
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("ERRO AO OBTER TOKEN:", tokenData);
      return res.status(500).json({ error: "Falha ao obter token SyncPay" });
    }

    const ACCESS_TOKEN = tokenData.access_token;

    // 2) CRIAR PIX REAL
    const pixRes = await fetch(`${API_BASE}/v1/charges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        amount: Number(value),
        payment_method: "pix",
        customer: {
          name,
          email,
          document
        }
      })
    });

    const pixData = await pixRes.json();
    console.log("PIX DATA:", pixData);

    if (pixData.error) {
      return res.status(400).json({ error: pixData.error });
    }

    return res.status(200).json({
      chargeId: pixData.id,
      qrCode: pixData.qrcode_base64,
      copyPaste: pixData.qrcode_text,
      status: pixData.status
    });

  } catch (error) {
    console.error("Erro SyncPay:", error);
    return res.status(500).json({ error: "Erro ao gerar PIX" });
  }
}
