# Recarga Games - Quiz Free Fire

Site de quiz/funil de vendas para Free Fire com sistema de desconto progressivo, idêntico ao design fornecido.

## 🎮 Funcionalidades Implementadas

### Fluxo Completo do Usuário
1. **Página Inicial**: Introdução ao desafio do 8º aniversário do Free Fire
2. **Break Page**: Página informativa sobre a promoção
3. **Quiz (6 perguntas)**:
   - Pergunta 1: Armas de longa distância
   - Pergunta 2: Primeiro mapa do Free Fire
   - Pergunta 3: Número de jogadores Battle Royale
   - Pergunta 4: Criador do Free Fire
   - Pergunta 5: Personagem com habilidade de cura
   - Pergunta 6: Intenção de compra
4. **Páginas de Erro**: Exibidas ao errar respostas (com opção de retry)
5. **Página de Cupom Reservado**: Mostra progresso e cupons restantes
6. **Loading Page**: Página de carregamento com depoimentos
7. **Página Final**: Congratulações e cupom de 90% desbloqueado
8. **Recharge Result**: Resumo do desconto e produtos disponíveis
9. **Checkout Garena**: Página de checkout completa estilo Garena oficial
   - Login com ID do jogador (validação 6-12 dígitos)
   - Carrossel de banners promocionais (Slick Carousel)
   - Seleção de jogos (Free Fire selecionado)
   - Pacotes de diamantes e ofertas especiais
   - Método de pagamento PIX pré-selecionado
   - Design fiel ao checkout oficial Garena
10. **Sistema de Pagamento**:
    - Integração Supabase + SyncPay para PIX real
    - Modal PIX com QR Code e copia-e-cola
    - Checkout alternativo com cartão e boleto disponível

### Sistema de Desconto
- Desconto progressivo: 0% → 15% → 30% → 45% → 60% → 75% → 90%
- Badge de desconto atualizado em tempo real
- Barra de progresso visual

### Design
- Cores: Amarelo (#ffb900), Preto, Branco
- Fonte: Poppins (Google Fonts)
- Animações de fade-in
- Layout responsivo (mobile-first)
- Badges e elementos visuais idênticos ao original

## 🛠️ Tecnologias

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (ícones)

## 📦 Estrutura do Projeto

```
src/
├── components/
│   ├── Header.tsx                # Cabeçalho com logo
│   ├── ProgressBar.tsx           # Barra de progresso
│   ├── DiscountBadge.tsx         # Badge de desconto
│   ├── IntroPage.tsx             # Página inicial
│   ├── QuizPage.tsx              # Página de quiz
│   ├── ErrorPage.tsx             # Página de erro
│   ├── BreakPage.tsx             # Página informativa
│   ├── CouponPage.tsx            # Página de cupom reservado
│   ├── LoadingPage.tsx           # Página de carregamento
│   ├── FinalPage.tsx             # Página final
│   ├── RechargeResultPage.tsx    # Página de resultado da recarga
│   └── checkout/                 # Sistema de checkout completo
│       ├── CheckoutPage.tsx      # Checkout profissional (cartão/boleto/PIX)
│       ├── CustomerForm.tsx      # Formulário de dados do cliente
│       ├── PaymentMethods.tsx    # Métodos de pagamento
│       ├── OrderSummary.tsx      # Resumo do pedido
│       ├── CouponInput.tsx       # Input de cupom
│       └── PixPayment.tsx        # Modal PIX
├── pages/
│   └── CheckoutGarena.tsx        # Checkout estilo Garena oficial
├── styles/
│   └── checkout-garena.css       # Estilos do checkout Garena
├── services/
│   └── checkoutService.ts        # Serviços de API (ViaCEP, cupons, pedidos)
├── utils/
│   └── validators.ts             # Validações e máscaras (CPF, CEP, cartão)
├── data/
│   └── quizData.ts               # Dados do quiz
├── types/
│   ├── quiz.ts                   # Tipos do quiz
│   └── checkout.ts               # Tipos do checkout
├── App.tsx                       # Componente principal com rotas
└── index.css                     # Estilos globais

supabase/
└── functions/
    └── create-payment/
        └── index.ts              # Edge Function para criar pagamento PIX

```

## 🚀 Como Usar

### Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais Supabase
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Configure as variáveis no arquivo `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Configure a API Key do SyncPay no painel do Supabase:
   - Settings > Edge Functions > Secrets
   - Adicione: `SYNCPAY_API_KEY`

## 📝 Funcionalidades do Checkout

### Checkout Garena (Integrado)
- Design 100% fiel ao checkout oficial Garena
- Login com ID do jogador
- Carrossel de banners
- Ofertas e pacotes de diamantes
- Pagamento PIX pré-configurado
- **Pronto para produção**

### Checkout Profissional (Disponível)
- Formulário completo de dados do cliente
- Validações em tempo real (CPF, CEP, cartão)
- Integração ViaCEP para endereços
- Sistema de cupons (teste: FF8ANOS90)
- Métodos de pagamento:
  - PIX (com QR Code real via SyncPay)
  - Cartão de Crédito (preparado para tokenização)
  - Boleto (estrutura pronta)

## 🎯 Fluxo de Navegação

```
Intro → Break → Quiz (6 perguntas) → Loading → Final → Recharge Result → Checkout Garena → Pagamento
                  ↓ (erro)
               Error Page
```

## ⚠️ Observações Importantes

- Todas as páginas foram replicadas fielmente ao design original
- Sistema de navegação completo entre páginas
- Respostas corretas/incorretas configuradas no `quizData.ts`
- Layout 100% responsivo (mobile-first)
- Checkout Garena totalmente integrado e funcional
- Sistema de pagamento PIX real via Supabase + SyncPay
- Validações client-side e server-side implementadas
- Analytics preparado (GA4 + Meta Pixel)
- Pronto para produção após configurar variáveis de ambiente

## 🎨 Personalização

Para modificar perguntas, respostas ou fluxo:
- Edite: `src/data/quizData.ts`

Para alterar cores ou estilos:
- Edite: `src/index.css` e componentes individuais

Para modificar o fluxo de navegação:
- Edite: `src/App.tsx`
