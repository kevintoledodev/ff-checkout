export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { value, name, email, document } = req.body;

    if (!value || !name || !email || !document) {
      return res.status(400).json({ error: "Campos faltando" });
    }

    // corrigir valores com vírgula
    const amount = Math.round(Number(String(value).replace(",", ".")) * 100);

    // pegar token
    const auth = await fetch("https://api.syncpay.com.br/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.SYNC_CLIENT_ID}:${process.env.SYNC_CLIENT_SECRET}`
          ).toString("base64"),
      },
      body: JSON.stringify({ grant_type: "client_credentials" }),
    });

    const token = await auth.json();

    if (!auth.ok) {
      return res.status(400).json({ error: "Erro ao gerar token", detail: token });
    }

    // criar PIX
    const pix = await fetch("https://api.syncpay.com.br/v1/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token}`,
      },
      body: JSON.stringify({
        amount,
        payment_method: "pix",
        customer: {
          name,
          email,
          document, // CPF sem pontos
          type: "individual",
        },
      }),
    });

    const data = await pix.json();

    if (!pix.ok) {
      return res.status(400).json({ error: data, message: "Erro ao criar PIX" });
    }

    return res.status(200).json({
      qrCode: data.pix.qr_code,
      copyPaste: data.pix.copy_paste,
      transactionId: data.identifier,
      expires_at: data.expires_at,
    });
  } catch (err) {
    console.log("ERRO CREATE PIX:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}
