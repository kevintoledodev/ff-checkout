// PixPayment.tsx
import React from "react";
import "../../styles/pixpayment.css";

interface PixPaymentProps {
  pixCode?: string | null;          // chave pix / copia e cola
  qrCodeBase64?: string | null;     // imagem do qrcode em base64
  amount?: number;
  merchantName?: string;
  merchantCnpj?: string;
  onBack?: () => void;
}

export default function PixPayment({
  pixCode = "",
  qrCodeBase64 = null,
  amount,
  merchantName,
  merchantCnpj,
  onBack = () => {}
}: PixPaymentProps) {

  const handleCopy = async () => {
    try {
      if (!pixCode) return;
      await navigator.clipboard.writeText(pixCode);
      // feedback simples
      alert("Código PIX copiado!");
    } catch (err) {
      console.error(err);
      alert("Não foi possível copiar o código.");
    }
  };

  return (
    <div className="pix-container">
      <h2 className="pix-title">Pague com Pix</h2>

      {/* mostra o qr se tiver base64 */}
      {qrCodeBase64 ? (
        <img
          src={`data:image/png;base64,${qrCodeBase64}`}
          alt="QR Code"
          className="pix-qrcode"
        />
      ) : (
        <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
          {/* placeholder */}
          QR Code não disponível
        </div>
      )}

      <div className="pix-merchant">
        <strong>{merchantName || "—"}</strong><br />
        CNPJ: {merchantCnpj || "—"}
      </div>

      <textarea
        readOnly
        className="pix-code-box"
        value={pixCode || ""}
      />

      <button
        className="pix-copy-btn"
        onClick={handleCopy}
      >
        Copiar Código
      </button>

      <div className="pix-instructions">
        <p>Para realizar o pagamento siga os passos abaixo:</p>
        <ol>
          <li>Abra o app ou o site da sua instituição financeira e selecione o Pix</li>
          <li>Utilize as informações acima para realizar o pagamento</li>
          <li>Revise as informações e pronto!</li>
        </ol>

        <p className="pix-status">
          Seu pedido está sendo processado pelo nosso parceiro de pagamentos.<br/>
          Assim que recebermos a confirmação do pagamento os diamantes serão entregues automaticamente.
        </p>

        <a href="https://customer.international.pagseguro.com/pt-br" target="_blank" rel="noreferrer">
          https://customer.international.pagseguro.com/pt-br
        </a>
      </div>

      <button className="pix-back-btn" onClick={onBack}>
        Voltar
      </button>
    </div>
  );
}
