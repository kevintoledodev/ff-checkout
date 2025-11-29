export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const { name, cpf, email, amount } = req.body;

    if (!name || !cpf || !email || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const API_BASE = process.env.SYNC_API_BASE;
    const CLIENT_ID = process.env.SYNC_CLIENT_ID;
    const CLIENT_SECRET = process.env.SYNC_CLIENT_SECRET;

    if (!API_BASE || !CLIENT_ID || !CLIENT_SECRET) {
      return res.status(500).json({ message: "Missing SyncPayments environment variables" });
    }

    // MOCK temporário
    const mockPix = {
      identifier: `pix_${Date.now()}`,
      pix_code: "00020101021226FAKEPIXCODE...123",
      qr_code_base64: null,
    };

    return res.status(200).json({
      identifier: mockPix.identifier,
      pix_code: mockPix.pix_code,
      qr_code_base64: mockPix.qr_code_base64,
    });

  } catch (err) {
    console.error("create-order error", err);
    return res.status(500).json({ message: "Internal server error", error: String(err) });
  }
}
