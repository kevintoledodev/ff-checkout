# Instruções - Página de Checkout Garena

Esta página é uma **réplica visual estática** do checkout encontrado em `https://jogosrecarga.xyz/dutty/logado.html?utm_source=organic`.

## Arquivos Criados

1. **checkout-reference.html** - Estrutura HTML completa
2. **checkout-styles.css** - Estilos CSS (cores, layout, responsividade)
3. **checkout-script.js** - Comportamento visual (carrosséis, modal, validações client-side)

## Como Usar

### 1. Abrir a Página

Abra o arquivo `checkout-reference.html` em qualquer navegador moderno.

```bash
# Ou inicie um servidor local:
npx serve .
# ou
python -m http.server 8000
```

### 2. Substituir Imagens

Todas as imagens estão com placeholders. Substitua nos locais indicados:

#### Banners do Carrossel (3 imagens)
```html
<!-- Linha ~47-49 em checkout-reference.html -->
<img src="placeholder-banner-1.jpg" alt="Banner promocional 1">
<img src="placeholder-banner-2.jpg" alt="Banner promocional 2">
<img src="placeholder-banner-3.jpg" alt="Banner promocional 3">
```
**Onde encontrar:** Use banners promocionais de Free Fire (1200x400px recomendado)

#### Ícones de Jogos
```html
<!-- Linha ~59 -->
<img src="placeholder-freefire-icon.jpg" alt="Free Fire">
<!-- Linha ~64 -->
<img src="placeholder-game-2.jpg" alt="Bella Force">
```
**Onde encontrar:** Ícones oficiais dos jogos (128x128px)

#### Background do Game Banner
```html
<!-- Linha ~83 -->
<img src="placeholder-ff-bg.jpg" alt="Free Fire Background">
<!-- Linha ~78 -->
<img src="placeholder-ff-small.jpg" alt="Free Fire">
```
**Onde encontrar:** Arte promocional de Free Fire (1920x600px)

#### Badges de Verificação
```html
<!-- Linhas ~149-151 -->
<img src="placeholder-badge-1.jpg" alt="Selo Verificado">
<img src="placeholder-badge-2.jpg" alt="Banner Angelical">
```
**Onde encontrar:** Criar badges personalizados ou usar ícones de verificação (200x200px)

#### Cards de Ofertas (6 imagens)
```html
<!-- Linhas ~185-233 -->
<img src="placeholder-offer-1.jpg" alt="Assinatura Semanal">
<img src="placeholder-offer-2.jpg" alt="Assinatura Mensal">
<img src="placeholder-offer-3.jpg" alt="Trilha da Evolução 3 dias">
<img src="placeholder-offer-4.jpg" alt="Trilha da Evolução 7 dias">
<img src="placeholder-offer-5.jpg" alt="Trilha da Evolução 30 dias">
<img src="placeholder-offer-6.jpg" alt="Semanal Econômica">
```
**Onde encontrar:** Imagens dos pacotes de Free Fire (400x300px)

**Dica:** Organize as imagens em uma pasta `/images` e atualize os caminhos:
```html
<img src="images/banner-1.jpg" alt="...">
```

### 3. Textos Personalizáveis

Todos os textos estão em **português brasileiro** copiados da referência original. Para alterar:

#### Valores e Preços
```html
<!-- Linha ~106: Desconto -->
<p class="discount-text">Você ganhou 90% de desconto!</p>

<!-- Linha ~108-109: Diamantes -->
<p class="diamonds">💎 5.600</p>
<p class="bonus">+ Bônus 1.200 💎</p>

<!-- Linha ~164: Preço do benefício especial -->
<p class="offer-price">R$69,70</p>

<!-- Linha ~258: Preço PIX -->
<p class="payment-price">R$ 19,90</p>
<p class="payment-bonus">+ Bônus 1.200 💎</p>

<!-- Linha ~270: Bottom bar -->
<span class="summary-diamonds">💎 5.600 + 1.200</span>
<span class="summary-total">Total: <strong>R$ 19,90</strong></span>
```

#### Ofertas (Nome e Preço)
```html
<!-- Exemplo: Linha ~187-190 -->
<p class="offer-name">Assinatura Semanal ℹ️</p>
<p class="offer-old-price">R$12,99</p>
<p class="offer-price">R$8,99</p>
```

### 4. Integração com Backend

O JavaScript está preparado para receber integrações reais. Localize os comentários `// TODO:` no arquivo `checkout-script.js`:

#### Processar Pagamento (Linha ~120)
```javascript
// TODO: Aqui você vai injetar a chamada real para o backend
fetch('/api/checkout/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        products: [
            { id: '1', name: '5.600 Diamantes', price: 19.90, quantity: 1 }
        ],
        customer: {
            playerId: '123456789', // Capturado do login
            email: 'usuario@email.com'
        },
        payment: {
            type: 'pix',
            amount: 19.90
        }
    })
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        orderNumber.textContent = data.orderId;
        successModal.classList.add('active');

        // Se for PIX, mostrar QR Code
        if (data.qrCode) {
            // Implementar modal de PIX
        }
    }
});
```

#### Endpoints Necessários

**POST /api/checkout/create**
- Criar pedido e processar pagamento
- Retornar: `{ success: true, orderId: "ORD-123", qrCode: "...", copyPaste: "..." }`

**GET /api/address/:cep**
- Buscar endereço por CEP (integração ViaCEP)
- Retornar: `{ street: "...", city: "...", state: "..." }`

**POST /api/coupon/validate**
- Validar cupom de desconto
- Retornar: `{ valid: true, discountPercentage: 90 }`

**POST /webhook/payment-status**
- Receber confirmação de pagamento
- Atualizar status do pedido

### 5. Comportamentos Implementados

#### Carrossel de Banners
- Rotação automática a cada 4 segundos
- Clique nos dots para trocar manualmente

#### Carrossel de Benefícios
- 10 benefícios diferentes
- Navegação com setas (← →)
- Indicadores de posição

#### Modal de Sucesso
- Exibido ao clicar em "Compre agora"
- Gera número de pedido de exemplo
- Fecha ao clicar fora ou no botão

#### Validações Visuais
- Verifica se há produtos no carrinho
- Verifica se método de pagamento está selecionado
- Verifica se usuário está logado

### 6. Máscaras e Validações (Prontas para Usar)

Funções disponíveis no `checkout-script.js`:

```javascript
formatCPF(value)        // 000.000.000-00
formatPhone(value)      // (00) 00000-0000
formatCEP(value)        // 00000-000
formatCardNumber(value) // 0000 0000 0000 0000
formatCardExpiry(value) // 00/00
validateCPF(cpf)        // true/false
validateEmail(email)    // true/false
```

Use em campos de formulário quando implementá-los:
```javascript
document.getElementById('cpf').addEventListener('input', (e) => {
    e.target.value = formatCPF(e.target.value);
});
```

### 7. Cores do Design

Palette principal (em `checkout-styles.css`):

```css
--primary-red: #E6252A    /* Garena Red */
--primary-orange: #FF9800 /* Ofertas especiais */
--accent-cyan: #00BCD4    /* Bônus, diamantes */
--success-green: #4CAF50  /* Confirmações */
--text-dark: #333         /* Textos principais */
--text-gray: #666         /* Textos secundários */
--bg-light: #f5f5f5       /* Background geral */
```

### 8. Responsividade

A página é **mobile-first** e se adapta automaticamente:

- **Mobile (< 768px):** Layout empilhado, botão voltar visível
- **Tablet (768px - 1024px):** Grid de 2 colunas para ofertas
- **Desktop (> 1024px):** Grid de 3 colunas, bottom bar centralizado

### 9. Acessibilidade

Recursos implementados:
- Labels semânticos em todos os elementos interativos
- Contraste adequado (WCAG AA)
- Botões com estados hover/focus
- Modal com backdrop para foco
- Alt text em todas as imagens

### 10. Próximos Passos (Para Produção)

1. **Adicionar formulário completo do comprador:**
   - Nome completo, CPF, E-mail, Telefone
   - Endereço completo (CEP com auto-preenchimento)

2. **Implementar métodos de pagamento:**
   - PIX (QR Code + Copia e Cola)
   - Cartão de Crédito (tokenização)
   - Boleto (geração e envio por e-mail)

3. **Integrar com gateway de pagamento:**
   - Mercado Pago, PagSeguro, Stripe, etc.
   - Webhook de confirmação

4. **Adicionar controle de quantidade:**
   - Botões +/- para ajustar quantidade de diamantes
   - Recalcular totais dinamicamente

5. **Implementar sistema de cupons:**
   - Input de cupom funcional
   - Validação assíncrona
   - Aplicação de desconto no total

6. **Analytics e rastreamento:**
   - Google Analytics / GA4
   - Meta Pixel (Facebook)
   - Eventos de conversão

7. **Segurança:**
   - HTTPS obrigatório
   - Validações server-side
   - Proteção contra CSRF
   - Rate limiting

## Suporte Técnico

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12) para erros
2. Confirme que todos os arquivos estão no mesmo diretório
3. Teste em múltiplos navegadores (Chrome, Firefox, Safari)

## Licença

Código destinado exclusivamente para o projeto Recarga Games / Garena.

---

**Desenvolvido em:** 2024-11-13
**Versão:** 1.0.0
**Compatibilidade:** Todos os navegadores modernos (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
