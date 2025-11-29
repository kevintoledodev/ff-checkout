export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { chargeId } = req.query;

  try {
    const syncResponse = await fetch(`https://api.syncpay.com.br/v1/charges/${chargeId}`, {
      headers: {
        Authorization: process.env.SYNC_API_KEY
      }
    });

    const data = await syncResponse.json();

    return res.status(200).json({
      status: data.status
    });

  } catch (error) {
    console.error("Erro SyncPay:", error);
    return res.status(500).json({ error: "Erro ao consultar status" });
  }
}
