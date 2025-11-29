export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, name, email, cpf } = req.body;

    if (!amount || !name || !email || !cpf) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    if (!process.env.SYNC_CLIENT_ID || !process.env.SYNC_CLIENT_SECRET) {
      return res.status(500).json({
        error: "Credenciais SyncPay não configuradas no ambiente."
      });
    }

    // 1) TOKEN
    const authResponse = await fetch("https://api.syncpay.app/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.SYNC_CLIENT_ID,
        client_secret: process.env.SYNC_CLIENT_SECRET
      })
    });

    const authData = await authResponse.json();

    if (!authResponse.ok || !authData.access_token) {
      return res.status(400).json({
        error: "Erro ao gerar token OAuth",
        details: authData
      });
    }

    // 2) PEDIDO
    const orderResponse = await fetch(
      "https://api.syncpay.app/api/order/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount,
          customer: { name, email, cpf }
        })
      }
    );

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      return res.status(400).json({
        error: "Erro ao gerar pedido PIX",
        details: orderData
      });
    }

    return res.status(200).json(orderData);
  } catch (err) {
    console.error("🔥 Erro interno do servidor:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
