// utils/getSyncToken.js
let cachedToken = null;
let tokenExpiry = 0;

async function fetchNewToken() {
  const resp = await fetch(`${process.env.SYNC_API_BASE}/oauth/token` /* ajuste se o endpoint for outro */, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.SYNC_CLIENT_ID,
      client_secret: process.env.SYNC_CLIENT_SECRET,
      grant_type: "client_credentials"
    })
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error("Erro obtendo token Sync: " + txt);
  }

  const json = await resp.json();
  // Ajuste os campos conforme o retorno da Sync (access_token / expires_in)
  const token = json.access_token || json.token || json.accessToken;
  const expiresIn = json.expires_in || 3600;
  return { token, expiresIn };
}

async function getSyncToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry - 30000) {
    return cachedToken;
  }

  const { token, expiresIn } = await fetchNewToken();
  cachedToken = token;
  tokenExpiry = Date.now() + expiresIn * 1000;
  return cachedToken;
}

module.exports = { getSyncToken };
