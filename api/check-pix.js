export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ error: "transactionId obrigatório" });
    }

    // token
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

    // consultar PIX
    const check = await fetch(
      `https://api.syncpay.com.br/v1/charges/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );

    const data = await check.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao consultar PIX" });
  }
}
