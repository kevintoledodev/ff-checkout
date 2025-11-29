# Sistema de Checkout Completo - Recarga Games

Sistema de checkout web completo e profissional para venda de diamantes Free Fire com integração de múltiplos métodos de pagamento (PIX, Cartão de Crédito, Boleto).

## Características Principais

### Layout e Design
- Design moderno e responsivo (mobile-first)
- Inspirado em grandes e-commerces brasileiros
- Cores profissionais: laranja (#f97316), cinza, branco
- Animações suaves e transições elegantes
- Header fixo com indicador de conexão segura
- Footer com links de política e termos

### Funcionalidades Implementadas

#### 1. Formulário de Dados do Cliente (pt-BR)
- **Nome Completo**: Validação de campo obrigatório
- **CPF**: Máscara automática (000.000.000-00) e validação de dígito verificador
- **E-mail**: Validação de formato
- **Celular**: Máscara (11) 99999-9999 com validação de DDD e 9º dígito
- **CEP**: Máscara 00000-000 com integração ViaCEP
- **Endereço Completo**: Auto-preenchimento via CEP
  - Logradouro, Número, Complemento (opcional)
  - Bairro, Cidade, Estado (dropdown com todas as UFs)
- Validação em tempo real com feedback visual
- Mensagens de erro claras em português

#### 2. Sistema de Cupom de Desconto
- Input com validação assíncrona
- Aplicação/remoção de cupons
- Cálculo automático do desconto
- Feedback visual de sucesso/erro
- Cupom de teste: **FF8ANOS90** (90% de desconto)

#### 3. Resumo do Pedido (Sidebar)
- Lista de produtos com imagem, nome, SKU
- Controle de quantidade (+/-)
- Remoção de itens
- Cálculo dinâmico:
  - Subtotal
  - Frete (configurável)
  - Desconto (cupom)
  - **Total**
- Badge de "Pagamento Seguro"
- Sticky no desktop para melhor UX

#### 4. Métodos de Pagamento

##### PIX
- Seleção visual com ícone
- Geração de QR Code dinâmico
- Código copia-e-cola
- Timer de 30 minutos
- Modal com instruções passo a passo
- Simulação de confirmação de pagamento
- Status: pendente → processando → aprovado

##### Cartão de Crédito
- Campos com máscaras automáticas:
  - Número do cartão (0000 0000 0000 0000)
  - Nome do titular (uppercase)
  - Validade (MM/AA)
  - CVV (3-4 dígitos)
- Detecção automática de bandeira (Visa, Mastercard, Elo, etc.)
- Validação de data de validade
- Checkbox "Salvar cartão para futuras compras"
- Nota de segurança sobre tokenização

##### Boleto
- Informações sobre prazo de vencimento (3 dias)
- Aprovação em até 2 dias úteis
- Geração após finalização do pedido
- Envio por e-mail

#### 5. Integração com APIs

##### ViaCEP (Implementado)
```typescript
// Auto-preenchimento de endereço por CEP
const address = await fetchAddressByCEP('01310-100');
// Retorna: logradouro, bairro, cidade, UF
```

##### Validação de Cupom (Mock + Real)
```typescript
// Validação assíncrona
const result = await validateCoupon('FF8ANOS90');
// Retorna: valid, discountPercentage, message
```

##### Criação de Pedido (Mock + Supabase)
```typescript
const response = await createOrder(orderData);
// PIX: retorna qrCode, copyPaste, orderId
// Cartão: retorna orderId, confirmação
// Boleto: retorna boletoUrl, orderId
```

#### 6. Segurança
- Validações client-side para UX
- Preparado para tokenização de cartão
- Não armazena dados sensíveis
- HTTPS obrigatório (nota no README)
- Content Security Policy preparado
- Máscaras impedem inserção de dados inválidos

#### 7. Analytics e Rastreamento
- Google Analytics / GA4 (placeholders)
- Meta Pixel (placeholders)
- Eventos implementados:
  - `view_checkout`
  - `begin_checkout`
  - `add_payment_info`
  - `add_coupon`
  - `purchase`
- Preservação de UTM params da URL

#### 8. Acessibilidade
- Labels em todos os campos
- ARIA attributes para leitores de tela
- Foco visível nos elementos
- Contraste adequado (WCAG AA)
- Mensagens de erro anunciadas
- Botões com estados disabled claros

## Estrutura de Arquivos

```
src/
├── components/
│   └── checkout/
│       ├── CheckoutPage.tsx          # Página principal
│       ├── CustomerForm.tsx          # Formulário de dados
│       ├── PaymentMethods.tsx        # Métodos de pagamento
│       ├── OrderSummary.tsx          # Resumo do pedido
│       ├── CouponInput.tsx           # Input de cupom
│       └── PixPayment.tsx            # Modal de pagamento PIX
├── services/
│   └── checkoutService.ts            # Serviços de API
├── types/
│   └── checkout.ts                   # TypeScript interfaces
├── utils/
│   └── validators.ts                 # Validações e máscaras
└── App.tsx                           # Integração principal
```

## Como Usar

### 1. Produtos Dinâmicos

Para injetar produtos dinamicamente via API/Bolt:

```typescript
import CheckoutPage from './components/checkout/CheckoutPage';
import { Product } from './types/checkout';

const products: Product[] = [
  {
    id: '1',
    name: '5.600 Diamantes',
    sku: 'FF-5600-DM',
    quantity: 1,
    price: 19.90,
    originalPrice: 199.00,
    imageUrl: '/diamantes.png',
    bonus: '+ 1.200 bônus',
  },
  {
    id: '2',
    name: '11.200 Diamantes',
    sku: 'FF-11200-DM',
    quantity: 1,
    price: 39.90,
    originalPrice: 399.00,
    imageUrl: '/diamantes.png',
    bonus: '+ 2.400 bônus',
  },
];

<CheckoutPage initialProducts={products} />
```

### 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase (Edge Functions e Database)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key

# API Base URL (opcional)
VITE_API_BASE_URL=https://api.seusite.com

# Google Analytics (opcional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Meta Pixel (opcional)
VITE_FB_PIXEL_ID=123456789
```

### 3. Endpoints Necessários

#### POST /api/checkout/create
```json
{
  "products": [...],
  "customer": {...},
  "payment": {...},
  "total": 19.90,
  "utmParams": {...}
}
```

**Resposta (PIX):**
```json
{
  "success": true,
  "orderId": "ORD-123456",
  "qrCode": "data:image/png;base64,...",
  "copyPaste": "00020126580014br.gov.bcb.pix..."
}
```

**Resposta (Cartão):**
```json
{
  "success": true,
  "orderId": "ORD-123456",
  "message": "Pagamento aprovado"
}
```

#### POST /api/coupon/validate
```json
{
  "code": "FF8ANOS90"
}
```

**Resposta:**
```json
{
  "valid": true,
  "discountPercentage": 90,
  "message": "Cupom aplicado com sucesso!"
}
```

#### POST /webhook/payment-status
```json
{
  "orderId": "ORD-123456",
  "status": "approved",
  "transactionId": "TXN-789"
}
```

### 4. Integração com Gateway de Pagamento

#### Para PIX:
A Edge Function `create-payment` já está configurada para gerar PIX via SyncPay.

**Passos:**
1. Configure a variável `SYNCPAY_API_KEY` no Supabase
2. O sistema gerará automaticamente QR Code e chave copia-e-cola
3. Webhook de confirmação receberá o status

#### Para Cartão de Crédito:
**Tokenização recomendada:**

```typescript
// Substitua os dados do cartão por um token
const cardToken = await tokenizeCard({
  number: cardData.number,
  holderName: cardData.holderName,
  expiry: cardData.expiry,
  cvv: cardData.cvv,
});

// Envie apenas o token ao backend
const response = await createOrder({
  ...orderData,
  payment: {
    type: 'credit_card',
    cardToken: cardToken,
  },
});
```

**Gateways sugeridos:**
- Stripe
- PagSeguro
- Mercado Pago
- Cielo
- Rede

#### Para Boleto:
Implemente a geração no backend e retorne a URL do boleto:

```typescript
const response = await createOrder({...});
// response.boletoUrl = 'https://boleto.com/123456'
```

### 5. Analytics

Para ativar Google Analytics e Meta Pixel, adicione no `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>

<!-- Meta Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '123456789');
  fbq('track', 'PageView');
</script>
```

## Modo Demo

O sistema possui um modo demo automático:
- Cupom `FF8ANOS90` sempre válido (90% desconto)
- PIX gera QR code de teste
- Pagamentos simulam aprovação após 10-15 segundos
- IDs de pedido são gerados localmente

## Checklist de Produção

### Antes de Ir ao Ar:

- [ ] Configurar variáveis de ambiente de produção
- [ ] Integrar gateway de pagamento real
- [ ] Ativar HTTPS (Let's Encrypt ou similar)
- [ ] Configurar webhook de confirmação de pagamento
- [ ] Testar fluxo completo de compra
- [ ] Ativar Google Analytics / Meta Pixel
- [ ] Configurar e-mail de confirmação de pedido
- [ ] Revisar política de privacidade e termos de uso
- [ ] Implementar rate limiting no backend
- [ ] Configurar backup de banco de dados
- [ ] Adicionar monitoramento de erros (Sentry)
- [ ] Testar em múltiplos dispositivos e navegadores
- [ ] Validar conformidade PCI DSS (se processar cartões)
- [ ] Configurar logs de transações
- [ ] Implementar sistema de retry para falhas de rede

### Segurança:

- [ ] Nunca armazenar PAN (número completo do cartão)
- [ ] Usar tokenização para dados de cartão
- [ ] Implementar CSP (Content Security Policy)
- [ ] Validar todos os dados no backend
- [ ] Implementar rate limiting por IP
- [ ] Configurar CORS adequadamente
- [ ] Adicionar proteção contra CSRF
- [ ] Sanitizar inputs contra XSS
- [ ] Implementar 2FA para acessos admin
- [ ] Configurar WAF (Web Application Firewall)

## Testes

### Dados para Teste:

**CPF válido:** 123.456.789-09 (teste, não usar em produção)
**CEP válido:** 01310-100 (Av. Paulista, São Paulo)
**Cupom teste:** FF8ANOS90
**Cartão teste:** 4111 1111 1111 1111 (Visa)

### Validações Implementadas:

1. **CPF**: Algoritmo completo de validação com dígitos verificadores
2. **E-mail**: Regex padrão RFC 5322
3. **Telefone**: DDD + 9 dígitos (formato brasileiro)
4. **CEP**: 8 dígitos com consulta ViaCEP
5. **Cartão**: Validação de BIN, detecção de bandeira
6. **Validade**: Mês (01-12) e ano futuro
7. **CVV**: 3-4 dígitos dependendo da bandeira

## Responsividade

### Breakpoints:
- **Mobile**: < 768px (layout empilhado)
- **Tablet**: 768px - 1024px (layout híbrido)
- **Desktop**: > 1024px (sidebar fixa)

### Testado em:
- iPhone SE, 12, 14 Pro Max
- Samsung Galaxy S20, S22
- iPad Air, iPad Pro
- Chrome, Firefox, Safari, Edge

## Performance

### Otimizações Implementadas:
- Lazy loading de componentes
- Validação debounced em inputs
- Memoização de cálculos pesados
- Code splitting automático (Vite)
- Imagens otimizadas
- CSS modular (Tailwind)

### Métricas Alvo:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

## Suporte e Manutenção

### Logs Importantes:
- Todos os eventos de analytics são logados no console (dev)
- Erros de API são capturados e logados
- Validações de formulário são rastreadas

### Debugging:
```typescript
// Ativar modo debug
localStorage.setItem('debug', 'true');

// Visualizar estado do formulário
console.log('Customer Data:', customerData);
console.log('Payment Method:', paymentMethod);
console.log('Order Total:', total);
```

## Contato e Suporte Técnico

Para dúvidas sobre implementação ou integração:
- Documentação completa disponível em cada componente
- Comentários inline no código
- TypeScript para autocompletar e type safety

## Licença

Este código é proprietário e destinado exclusivamente para Recarga Games.

---

**Desenvolvido com:**
React 18 + TypeScript + Tailwind CSS + Vite

**Última atualização:** 2024-11-13
