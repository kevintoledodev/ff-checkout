// PixPayment.tsx
import React from "react";
import "../../styles/pixpayment.css";

interface PixPaymentProps {
  pixCode: string;            // código copia e cola
  qrCodeBase64: string;       // imagem do QR em base64
  amount: number;             // valor do pedido
  merchantName: string;
  merchantCnpj: string;
  onBack: () => void;
}

export default function PixPayment({
  pixCode,
  qrCodeBase64,
  amount,
  merchantName,
  merchantCnpj,
  onBack
}: PixPaymentProps) {

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      alert("Código PIX copiado!");
    } catch (err) {
      console.error("Erro ao copiar PIX:", err);
      alert("Não foi possível copiar o código.");
    }
  };

  return (
    <div className="pix-container">

      {/* TÍTULO */}
      <h2 className="pix-title">Pagamento via Pix</h2>

      {/* QR CODE */}
      {qrCodeBase64 ? (
        <img
          src={`data:image/png;base64,${qrCodeBase64}`}
          alt="QR Code"
          className="pix-qrcode"
        />
      ) : (
        <div className="pix-qrcode pix-qrcode--placeholder">
          QR Code não disponível
        </div>
      )}

      {/* MERCHANT */}
      <div className="pix-merchant">
        <strong>{merchantName}</strong><br />
        CNPJ: {merchantCnpj}
      </div>

      {/* VALOR */}
      <p className="pix-amount">
        Valor: <strong>R$ {amount.toFixed(2)}</strong>
      </p>

      {/* COPIA E COLA */}
      <textarea
        readOnly
        className="pix-code-box"
        value={pixCode}
      />

      <button className="pix-copy-btn" onClick={handleCopy}>
        Copiar código Pix
      </button>

      {/* INSTRUÇÕES */}
      <div className="pix-instructions">
        <p>Para realizar o pagamento siga os passos abaixo:</p>
        <ol>
          <li>Abra o app do seu banco e escolha a opção <strong>Pix → Copia e Cola</strong>.</li>
          <li>Cole o código Pix copiado.</li>
          <li>Confirme os dados e finalize o pagamento.</li>
        </ol>

        <p className="pix-status">
          Estamos aguardando a confirmação do parceiro de pagamento.<br />
          Assim que o pagamento for aprovado, os diamantes serão entregues automaticamente.
        </p>

        <a
          href="https://customer.international.pagseguro.com/pt-br"
          target="_blank"
          rel="noreferrer"
          className="pix-help-link"
        >
          Suporte PagSeguro
        </a>
      </div>

      {/* VOLTAR */}
      <button className="pix-back-btn" onClick={onBack}>
        Voltar
      </button>

    </div>
  );
}
