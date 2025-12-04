export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { value, user_id, cpf } = req.body;

  try {
    const response = await fetch("http://localhost:3001/api/create-pix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value, user_id, cpf }),
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: "Erro interno ao criar PIX" });
  }
}
