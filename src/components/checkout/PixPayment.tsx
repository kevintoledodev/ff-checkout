import QRCode from "qrcode";
import React, { useEffect, useState } from "react";
import "../../styles/pixpayment.css";

interface PixPaymentProps {
  identifier: string;
  pixCode: string;
  qrCodeBase64: string;
  amount: number;
  merchantName: string;
  merchantCnpj: string;
  onBack: () => void;
  onPaid?: () => void;
}

export default function PixPayment({
  identifier,
  pixCode,
  qrCodeBase64,
  amount,
  onBack,
  onPaid
}: PixPaymentProps) {

  const [status, setStatus] = useState("Aguardando pagamento");
  const statusMap: Record<string, string> = {
    waiting: "Aguardando pagamento",
    verified: "Pagamento aprovado",
    expired: "Expirado",
    refunded: "Recusado",
  };


  const [showPixExpiredModal,  setShowPixExpiredModal] = useState(false);

  // =============================
  // CHECK AUTOMÁTICO EASYPIX
  // =============================
  useEffect(() => {
    if (!identifier) return;

    console.log("▶️ Iniciando verificação PIX (easy-pix):", identifier);

    const interval = setInterval(async () => {
      try {
        const req = await fetch(`http://localhost:3001/api/check-pix/${identifier}`);
        const data = await req.json();

        console.log("🔎 CHECK EASY-PIX RESULT:", data);

        if (data?.status) {
          setStatus(data.status);

          if (data.status === "verified") {
            clearInterval(interval);
            alert("Pagamento aprovado!");
            onPaid && onPaid();
          }

          if (data.status === "expired" || data.status === "refunded") {
            setShowPixExpiredModal(true)
          }
        }
      } catch (error) {
        console.log("Erro ao consultar PIX:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [identifier]);



  // =============================
  // COPIAR CÓDIGO PIX
  // =============================

  const [showCopiedModal, setShowCopiedModal] = useState(false);

  const copyPix = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(pixCode);
      } else {
        // fallback
        const textArea = document.createElement("textarea");
        textArea.value = pixCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }

      setShowCopiedModal(true);

      setTimeout(() => {
        setShowCopiedModal(false);
      }, 1800);

    } catch (error) {
      console.log("Erro ao copiar.");
    }
  };


  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      alert("Código Pix copiado!");
    } catch (err) {
      alert("Não foi possível copiar o código Pix.");
    }

    document.body.removeChild(textarea);
  };

  // =============================
  // UI (NÃO ALTERADA)
  // =============================
  return (


    <div className="pix-container">
      <h2 className="pix-title">Pagamento via Pix</h2>

      {/* QR CODE — somente substituí a imagem interna, nada da UI mudou */}
      {qrCodeBase64 ? (
        <img
          src={qrCodeBase64}
          alt="QR Code"
          className="pix-qrcode"
        />
      ) : (
        <div className="pix-qrcode pix-qrcode--placeholder">
          QR Code não disponível
        </div>
      )}



      <p className="pix-amount">
        Valor: <strong>R$ {amount.toFixed(2)}</strong>
      </p>

      <textarea readOnly className="pix-code-box" value={pixCode} />

      <button className="pix-copy-btn" onClick={() => copyPix(pixCode)}>
        Copiar código Pix
      </button>

      {showCopiedModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] fade-in copied-modal ">
          <div className="bg-white p-6 rounded-lg shadow-xl w-72 text-center animate-popup copied-modal  ">
            <h3 className="text-lg font-bold mb-2 text-green-600">Código copiado!</h3>
            <p className="text-gray-700 text-sm">Cole no app do seu banco para finalizar o pagamento.</p>
          </div>
        </div>
      )}

      {showPixExpiredModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] fade-in">
          <div className="modal-alert">
            <h3 className="text-lg font-bold mb-2 text-red-600">PIX expirado!</h3>

            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              O PIX expirou ou foi recusado.<br />
              Gere um novo pagamento para continuar.
            </p>

            <button
              onClick={() => setShowPixExpiredModal(false)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg w-full hover:bg-red-700 transition"
            >
              Entendi
            </button>
          </div>
        </div>
      )}


      <p className="pix-status">
        Status do pagamento: <strong>{statusMap[status] || status}</strong>

      </p>

      <div className="pix-instructions">
        <p>Siga os passos abaixo:</p>
        <ol>
          <li>Acesse o app do seu banco e escolha <strong>Pix → Copia e Cola</strong>.</li>
          <li>Cole o código Pix.</li>
          <li>Confirme os dados e finalize.</li>
        </ol>

        <p className="pix-status">
          Estamos aguardando a confirmação do pagamento.<br />
          Assim que aprovado, liberaremos automaticamente.
        </p>
      </div>

      <button className="pix-back-btn" onClick={onBack}>
        Voltar
      </button>
    </div>
  );
}
