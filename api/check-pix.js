export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { value, name, email, document } = req.body;

  try {
    // PEGAR TOKEN
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

    // CRIAR PIX
    const pix = await fetch("https://api.syncpay.com.br/v1/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token}`,
      },
      body: JSON.stringify({
        amount: value,
        payer: {
          name,
          email,
          document,
        },
      }),
    });

    const data = await pix.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao gerar PIX" });
  }
}
