// PaymentMethods.tsx — REFEITO ESTILO RECARGA JOGO
import { useState } from "react";
import { PaymentMethod } from "../../types/checkout";
import {
  formatCardNumber,
  formatCardExpiry,
  formatCardCVV,
  getCardBrand,
} from "../../utils/validators";
import { CreditCard, QrCode, FileText, XCircle } from "lucide-react";
import "./paymentmethods.css";


interface PaymentMethodsProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  errors: Record<string, string>;
  onValidate: (field: string, isValid: boolean) => void;
}

export default function PaymentMethods({
  selectedMethod,
  onMethodChange,
  errors,
  onValidate,
}: PaymentMethodsProps) {
  const [cardBrand, setCardBrand] = useState("unknown");

  const handleTypeChange = (type: "pix" | "credit_card" | "boleto") => {
    onMethodChange({ ...selectedMethod, type });
  };

  const handleCardChange = (
    field: keyof NonNullable<PaymentMethod["cardData"]>,
    value: string
  ) => {
    const data =
      selectedMethod.cardData || {
        number: "",
        holderName: "",
        expiry: "",
        cvv: "",
        saveCard: false,
      };

    let formatted = value;

    if (field === "number") {
      formatted = formatCardNumber(value);
      const brand = getCardBrand(formatted);
      setCardBrand(brand);
      onValidate("cardNumber", formatted.replace(/\s/g, "").length >= 13);
    }

    if (field === "expiry") {
      formatted = formatCardExpiry(value);

      if (formatted.length === 5) {
        const [mm, yy] = formatted.split("/");
        const nowY = new Date().getFullYear() % 100;
        const nowM = new Date().getMonth() + 1;
        const isValid =
          parseInt(mm) >= 1 &&
          parseInt(mm) <= 12 &&
          (parseInt(yy) > nowY ||
            (parseInt(yy) === nowY && parseInt(mm) >= nowM));

        onValidate("cardExpiry", isValid);
      }
    }

    if (field === "cvv") {
      formatted = formatCardCVV(value);
      onValidate("cardCVV", formatted.length >= 3);
    }

    onMethodChange({
      ...selectedMethod,
      cardData: { ...data, [field]: formatted },
    });
  };

  return (
    <div className="pm-container">
      <h2 className="pm-title">Método de Pagamento</h2>

      {/* SELEÇÃO DE MÉTODOS */}
      <div className="pm-methods">
        {/* PIX */}
        <button
          type="button"
          onClick={() => handleTypeChange("pix")}
          className={`pm-btn ${
            selectedMethod.type === "pix" ? "pm-active" : ""
          }`}
        >
          <QrCode size={24} className="pm-icon" />
          <div className="pm-btn-info">
            <span className="pm-btn-title">PIX</span>
            <span className="pm-btn-sub">Aprovação imediata</span>
          </div>
        </button>

        {/* CARTÃO */}
        <button
          type="button"
          onClick={() => handleTypeChange("credit_card")}
          className={`pm-btn ${
            selectedMethod.type === "credit_card" ? "pm-active" : ""
          }`}
        >
          <CreditCard size={24} className="pm-icon" />
          <div className="pm-btn-info">
            <span className="pm-btn-title">Cartão de Crédito</span>
            <span className="pm-btn-sub">Parcelamento disponível</span>
          </div>
        </button>

        {/* BOLETO */}
        <button
          type="button"
          onClick={() => handleTypeChange("boleto")}
          className={`pm-btn ${
            selectedMethod.type === "boleto" ? "pm-active" : ""
          }`}
        >
          <FileText size={24} className="pm-icon" />
          <div className="pm-btn-info">
            <span className="pm-btn-title">Boleto</span>
            <span className="pm-btn-sub">Vencimento em 3 dias</span>
          </div>
        </button>
      </div>

      {/* PIX INFO */}
      {selectedMethod.type === "pix" && (
        <div className="pm-box pm-pix-box">
          <p><strong>Pagamento via PIX:</strong></p>
          <ul>
            <li>Aprovação instantânea</li>
            <li>QR Code gerado na próxima etapa</li>
            <li>Válido por 30 minutos</li>
          </ul>
        </div>
      )}

      {/* CARTÃO INFO */}
      {selectedMethod.type === "credit_card" && (
        <div className="pm-box pm-card-box">
          {/* NÚMERO */}
          <label className="pm-label">Número do Cartão *</label>
          <div className="pm-input-wrapper">
            <input
              type="text"
              value={selectedMethod.cardData?.number || ""}
              onChange={(e) => handleCardChange("number", e.target.value)}
              className={`pm-input ${errors.cardNumber ? "pm-error" : ""}`}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
            />

            {/* MARCA */}
            {cardBrand !== "unknown" && (
              <span className="pm-card-brand">{cardBrand.toUpperCase()}</span>
            )}
          </div>
          {errors.cardNumber && (
            <p className="pm-err-text">
              <XCircle size={12} /> {errors.cardNumber}
            </p>
          )}

          {/* TITULAR */}
          <label className="pm-label">Nome do Titular *</label>
          <input
            type="text"
            value={selectedMethod.cardData?.holderName || ""}
            onChange={(e) =>
              handleCardChange("holderName", e.target.value.toUpperCase())
            }
            className={`pm-input ${errors.cardHolder ? "pm-error" : ""}`}
            placeholder="NOME COMO NO CARTÃO"
          />
          {errors.cardHolder && (
            <p className="pm-err-text">
              <XCircle size={12} /> {errors.cardHolder}
            </p>
          )}

          <div className="pm-row">
            {/* VALIDADE */}
            <div>
              <label className="pm-label">Validade *</label>
              <input
                type="text"
                value={selectedMethod.cardData?.expiry || ""}
                onChange={(e) => handleCardChange("expiry", e.target.value)}
                className={`pm-input ${errors.cardExpiry ? "pm-error" : ""}`}
                placeholder="MM/AA"
                maxLength={5}
              />
              {errors.cardExpiry && (
                <p className="pm-err-text">
                  <XCircle size={12} /> {errors.cardExpiry}
                </p>
              )}
            </div>

            {/* CVV */}
            <div>
              <label className="pm-label">CVV *</label>
              <input
                type="text"
                value={selectedMethod.cardData?.cvv || ""}
                onChange={(e) => handleCardChange("cvv", e.target.value)}
                className={`pm-input ${errors.cardCVV ? "pm-error" : ""}`}
                placeholder="123"
                maxLength={4}
              />
              {errors.cardCVV && (
                <p className="pm-err-text">
                  <XCircle size={12} /> {errors.cardCVV}
                </p>
              )}
            </div>
          </div>

          {/* SALVAR CARTÃO */}
          <label className="pm-save">
            <input
              type="checkbox"
              checked={selectedMethod.cardData?.saveCard || false}
              onChange={(e) =>
                onMethodChange({
                  ...selectedMethod,
                  cardData: {
                    ...(selectedMethod.cardData || {}),
                    saveCard: e.target.checked,
                  },
                })
              }
            />
            Salvar cartão para futuras compras
          </label>

          <div className="pm-info-box">
            Seus dados são criptografados e não armazenamos o cartão completo.
          </div>
        </div>
      )}

      {/* BOLETO */}
      {selectedMethod.type === "boleto" && (
        <div className="pm-box pm-boleto-box">
          <p><strong>Pagamento via Boleto:</strong></p>
          <ul>
            <li>Gerado na próxima etapa</li>
            <li>Prazo: 3 dias úteis</li>
            <li>Aprovação em até 2 dias úteis</li>
            <li>Você receberá o boleto por e-mail</li>
          </ul>
        </div>
      )}
    </div>
  );
}
