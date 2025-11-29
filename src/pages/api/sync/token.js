// pages/api/sync/token.js
import { getSyncToken } from "../../../utils/getSyncToken";

export default async function handler(req, res) {
  try {
    const token = await getSyncToken();
    return res.status(200).json({ token });
  } catch (err) {
    console.error("token error:", err.message || err);
    return res.status(500).json({ error: err.message || "erro" });
  }
}
