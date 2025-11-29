export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { value, name, email, document } = req.body;

    const syncResponse = await fetch("https://api.syncpay.com.br/v1/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.SYNC_API_KEY
      },
      body: JSON.stringify({
        price: value,
        payment_method: "pix",
        customer: {
          name,
          email,
          document
        }
      })
    });

    const data = await syncResponse.json();

    return res.status(200).json({
      chargeId: data.id,
      qrCode: data.qrcode_base64,
      copyPaste: data.qrcode_text,
      status: data.status
    });

  } catch (error) {
    console.error("Erro SyncPay:", error);
    return res.status(500).json({ error: "Erro ao gerar PIX" });
  }
}
