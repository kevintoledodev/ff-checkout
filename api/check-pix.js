export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { identifier } = req.body;

  if (!identifier) {
    return res.status(400).json({ error: "identifier obrigatório" });
  }

  try {
    const r = await fetch(`http://localhost:3001/api/check-pix/${identifier}`);
    const data = await r.json();

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Erro interno ao consultar PIX" });
  }
}
