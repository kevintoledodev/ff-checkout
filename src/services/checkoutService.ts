// checkoutService.ts — VERSÃO OTIMIZADA E FINAL

import {
  Order,
  ViaCEPResponse,
  CouponValidationResponse,
  PaymentResponse,
} from "../types/checkout";


export interface CustomerData {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  birthDate?: string;
}

/* ======================================================
   1) CONSULTAR CEP
====================================================== */
export const fetchAddressByCEP = async (
  cep: string
): Promise<ViaCEPResponse | null> => {
  try {
    const cleanCEP = cep.replace(/[^\d]/g, "");
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);

    if (!response.ok) throw new Error("CEP não encontrado");

    const data: ViaCEPResponse = await response.json();

    if ((data as any).erro) throw new Error("CEP não encontrado");

    return data;
  } catch (error) {
    console.error("Erro buscando CEP:", error);
    return null;
  }
};

/* ======================================================
   2) VALIDAR CUPOM
====================================================== */
export const validateCoupon = async (
  couponCode: string
): Promise<CouponValidationResponse> => {
  try {
    if (couponCode.toUpperCase() === "FF8ANOS90") {
      return {
        valid: true,
        discountPercentage: 90,
        message: "Cupom aplicado com sucesso!",
      };
    }

    return {
      valid: false,
      message: "Cupom inválido.",
    };
  } catch (error) {
    console.error("Erro ao validar cupom:", error);
    return {
      valid: false,
      message: "Erro ao validar cupom.",
    };
  }
};

/* ======================================================
   3) GERAR PIX VIA VERCEL — DEFINITIVO
====================================================== */
export async function createPixViaVercel(order: Order) {
  const endpoint = "/api/create-order";

  const payload = {
    value: Number(order.total.toFixed(2)),      // valor correto
    name: order.customer.fullName,
    email: order.customer.email,
    document: order.customer.cpf.replace(/\D/g, ""), // CPF correto
  };

  console.log("→ Enviando pedido para Vercel API...", payload);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data;

  try {
    data = await response.json();
  } catch (error) {
    console.error("🔥 Erro convertendo JSON:", error);
    throw new Error("Resposta inválida da API");
  }

  if (!response.ok) {
    console.error("🔥 Erro API Vercel:", data);
    throw new Error(data?.error || "Erro ao gerar Pix");
  }

  console.log("→ Resposta da SyncPay:", data);

  return {
    transactionId: data.identifier,
    qrCode: data.pix_code,
    copyPaste: data.pix_code,
  };
}
  
/* ======================================================
   4) UTM
====================================================== */
export const getUTMParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(
    (key) => {
      const value = params.get(key);
      if (value) utmParams[key] = value;
    }
  );

  return utmParams;
};

/* ======================================================
   5) ANALYTICS
====================================================== */
export const sendAnalyticsEvent = (
  eventName: string,
  eventData?: Record<string, unknown>
) => {
  if (typeof window !== "undefined") {
    if (window.gtag) window.gtag("event", eventName, eventData);
    if (window.fbq) window.fbq("track", eventName, eventData);
  }
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}
