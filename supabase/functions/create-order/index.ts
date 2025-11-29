// supabase/functions/create-order/index.ts

import { serve } from "https://deno.land/std@v1/http/server.ts";

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405 }
      );
    }

    const { amount, name, email, cpf } = await req.json();

    if (!amount || !name || !email || !cpf) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios ausentes." }),
        { status: 400 }
      );
    }

    const clientId = Deno.env.get("SYNC_CLIENT_ID");
    const clientSecret = Deno.env.get("SYNC_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ error: "Credenciais SyncPay ausentes." }),
        { status: 500 }
      );
    }

    // ============================================================
    // 1) GERAR TOKEN
    // ============================================================
    const authResponse = await fetch("https://api.syncpay.app/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const authData = await authResponse.json();

    if (!authResponse.ok || !authData.access_token) {
      return new Response(
        JSON.stringify({
          error: "Erro ao gerar token OAuth",
          details: authData,
        }),
        { status: 400 }
      );
    }

    // ============================================================
    // 2) CRIAR PEDIDO PIX
    // ============================================================
    const orderResponse = await fetch(
      "https://api.syncpay.app/api/order/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          customer: { name, email, cpf },
        }),
      }
    );

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      return new Response(
        JSON.stringify({
          error: "Erro ao criar pedido PIX",
          details: orderData,
        }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify(orderData), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Erro interno", details: err.message }),
      { status: 500 }
    );
  }
});
