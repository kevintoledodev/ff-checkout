// ============================================
// CHECKOUT SCRIPT - VISUAL BEHAVIOR ONLY
// ============================================

// Banners Carousel
let currentBannerIndex = 0;
const bannerSlides = document.querySelectorAll('.banner-slide');
const bannerDots = document.querySelectorAll('.carousel-dots .dot');

function showBanner(index) {
    bannerSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    bannerDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextBanner() {
    currentBannerIndex = (currentBannerIndex + 1) % bannerSlides.length;
    showBanner(currentBannerIndex);
}

// Auto-rotate banners every 4 seconds
setInterval(nextBanner, 4000);

// Click on dots to change banner
bannerDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentBannerIndex = index;
        showBanner(currentBannerIndex);
    });
});

// Benefits Carousel
const benefitsData = [
    "🏆 Acesso antecipado a eventos e testes beta 🎮",
    "⭐ Selo de Verificado ao lado do seu nome",
    "💎 Perfil com selo azul diferenciado",
    "👑 Mais respeito na comunidade",
    "✨ Destaque em salas e partidas",
    "🎁 Recompensas exclusivas mensais",
    "🔥 Badge especial no perfil",
    "💪 Prioridade no suporte",
    "🎯 Convites VIP para torneios",
    "🌟 Reconhecimento como jogador premium"
];

let currentBenefitIndex = 1;
const benefitSlide = document.querySelector('.benefit-slide');
const indicators = document.querySelectorAll('.carousel-indicators .indicator');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

function showBenefit(index) {
    benefitSlide.textContent = benefitsData[index];
    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
    });
}

prevBtn.addEventListener('click', () => {
    currentBenefitIndex = (currentBenefitIndex - 1 + benefitsData.length) % benefitsData.length;
    showBenefit(currentBenefitIndex);
});

nextBtn.addEventListener('click', () => {
    currentBenefitIndex = (currentBenefitIndex + 1) % benefitsData.length;
    showBenefit(currentBenefitIndex);
});

// Initialize first benefit
showBenefit(currentBenefitIndex);

// Back Button
const btnBack = document.getElementById('btnBack');
btnBack.addEventListener('click', () => {
    // TODO: Implementar navegação real
    alert('Voltando para a página anterior...');
    // window.history.back();
});

// Login Button
const btnLogin = document.getElementById('btnLogin');
btnLogin.addEventListener('click', () => {
    // TODO: Implementar lógica de login/logout
    alert('Você já está logado! ID do jogador conectado.');
});

// Acquire Benefit Button
const btnAcquire = document.querySelector('.btn-acquire');
btnAcquire.addEventListener('click', () => {
    // TODO: Adicionar benefício ao carrinho
    alert('Benefício "Se Torne Verificado" adicionado! Valor: R$69,70');
});

// Offer Cards Click
const offerCards = document.querySelectorAll('.offer-card');
offerCards.forEach(card => {
    card.addEventListener('click', () => {
        // TODO: Adicionar oferta ao carrinho
        const offerName = card.querySelector('.offer-name').textContent;
        const offerPrice = card.querySelector('.offer-price').textContent;
        alert(`Oferta selecionada: ${offerName}\nPreço: ${offerPrice}`);
    });
});

// Buy Button - Show Success Modal
const btnBuy = document.getElementById('btnBuy');
const successModal = document.getElementById('successModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const orderNumber = document.getElementById('orderNumber');

btnBuy.addEventListener('click', () => {
    // Validações visuais simples
    const validationPassed = validateCheckout();

    if (validationPassed) {
        // Gerar número de pedido de exemplo
        const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        orderNumber.textContent = orderId;

        // Mostrar modal de sucesso
        successModal.classList.add('active');

        // TODO: Aqui você vai injetar a chamada real para o backend
        // Exemplo:
        // fetch('/api/checkout/create', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         products: [...],
        //         customer: {...},
        //         payment: {...}
        //     })
        // })
        // .then(response => response.json())
        // .then(data => {
        //     if (data.success) {
        //         orderNumber.textContent = data.orderId;
        //         successModal.classList.add('active');
        //     }
        // });
    }
});

// Close Modal
btnCloseModal.addEventListener('click', () => {
    successModal.classList.remove('active');
    // TODO: Redirecionar para página de confirmação ou histórico de pedidos
    // window.location.href = '/pedidos';
});

// Close modal clicking outside
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
    }
});

// Validation Function (Visual Only)
function validateCheckout() {
    // Verificar se há produtos no carrinho (visual)
    const hasDiamonds = document.querySelector('.summary-diamonds');
    if (!hasDiamonds || !hasDiamonds.textContent) {
        alert('Nenhum produto selecionado!');
        return false;
    }

    // Verificar se método de pagamento está selecionado (visual)
    const paymentSelected = document.querySelector('.payment-method-card .payment-selected');
    if (!paymentSelected) {
        alert('Selecione um método de pagamento!');
        return false;
    }

    // Verificar login (visual)
    const loginBtn = document.getElementById('btnLogin');
    if (loginBtn.textContent !== 'LOGADO!') {
        alert('Você precisa fazer login primeiro!');
        return false;
    }

    return true;
}

// Máscaras e Formatações (para futuros campos de formulário)
// TODO: Adicionar quando implementar campos de CPF, telefone, CEP, etc.

function formatCPF(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatPhone(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
}

function formatCEP(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
}

function formatCardNumber(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{4})(?=\d)/g, '$1 ')
        .trim();
}

function formatCardExpiry(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\/\d{2})\d+?$/, '$1');
}

// Validação de CPF (Algoritmo padrão brasileiro)
function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

// Validação de Email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Recalcular totais (para quando adicionar controle de quantidade)
function recalculateTotals() {
    // TODO: Implementar lógica de recálculo quando adicionar controle de quantidade
    // Exemplo:
    // const subtotal = calculateSubtotal();
    // const shipping = calculateShipping();
    // const discount = calculateDiscount();
    // const total = subtotal + shipping - discount;
    // updateSummaryDisplay(total);
}

// Event Listeners para campos de formulário (quando implementados)
// Exemplo:
// document.getElementById('cpf').addEventListener('input', (e) => {
//     e.target.value = formatCPF(e.target.value);
// });

// Console log para debug
console.log('Checkout page loaded successfully!');
console.log('TODO: Implementar integração com backend para:');
console.log('- Processamento de pagamento');
console.log('- Validação de cupons');
console.log('- Consulta de endereço por CEP');
console.log('- Salvamento de pedidos');
console.log('- Webhooks de confirmação de pagamento');
