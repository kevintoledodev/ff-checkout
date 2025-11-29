# Guia de Substituição de Imagens - Checkout Garena

Este documento lista todas as imagens placeholder criadas para o checkout Garena e onde substituí-las pelas imagens reais.

## Localização dos Arquivos

- **Componente React**: `/src/pages/CheckoutGarena.tsx`
- **CSS**: `/src/styles/checkout-garena.css`

## Lista de Imagens a Substituir

### 1. Header (Logo)

**Linha 49-50 em CheckoutGarena.tsx:**
```tsx
<img src="/placeholder-logo-mobile.svg" alt="Garena" className="d-block d-lg-none d-xl-none" />
<img src="/placeholder-logo.svg" alt="Garena" className="d-none d-lg-block d-xl-block" />
```
**Substituir por:**
- `images/placeholder-logo-mobile.svg` → Logo Garena versão mobile (ex: `images/logo_mobile.svg`)
- `images/placeholder-logo.svg` → Logo Garena versão desktop (ex: `images/logo.svg`)

---

### 2. Avatar do Usuário

**Linha 56 em CheckoutGarena.tsx:**
```tsx
<img src="images/placeholder-avatar.svg" alt="Player Avatar" width="30" style={{ borderRadius: '50%' }} />
```
**Substituir por:**
- `/placeholder-avatar.svg` → Avatar padrão do jogador (ex: `images/avatar.svg`)

---

### 3. Banners do Carrossel (3 imagens)

**Linhas 64-72 em CheckoutGarena.tsx:**
```tsx
<img src="/banner.png" alt="Free Fire" />
<img src="/banner_02.png" alt="Free Fire" />
<img src="/banner_03.png" alt="Free Fire" />
```
**Substituir por:**
- `/banner.png` → Já existe na pasta `images/` (usar diretamente)
- `/banner_02.png` → Já existe na pasta `images/` (usar diretamente)
- `/banner_03.png` → Já existe na pasta `images/` (usar diretamente)

**NOTA:** Estas 3 imagens já estão corretas, apenas certifique-se de que existem na pasta `/images/`

---

### 4. Background da Headline (2 versões)

**Linhas 93-94 em CheckoutGarena.tsx:**
```tsx
<img src="/placeholder-cover.svg" alt="FreeFire" className="d-none d-lg-block d-xl-block" />
<img src="/placeholder-cover-mobile.svg" alt="FreeFire" className="d-block d-lg-none d-xl-none" />
```
**Substituir por:**
- `/placeholder-cover.svg` → Background Free Fire desktop (ex: `images/cover.svg`)
- `/placeholder-cover-mobile.svg` → Background Free Fire mobile (ex: `images/cover_mobile.svg`)

---

### 5. Ícone de Check (Seleção de Jogo)

**Linha 102 em CheckoutGarena.tsx:**
```tsx
<img src="/placeholder-check.svg" alt="Check" />
```
**Substituir por:**
- `/placeholder-check.svg` → Ícone de check verde (ex: `images/check.svg`)

---

### 6. Ícones dos Jogos

**Linhas 104 e 108 em CheckoutGarena.tsx:**
```tsx
<img src="/icon.png" alt="Free Fire" />
<img src="/placeholder-icon-c.png" alt="Delta Force" />
```
**Substituir por:**
- `/icon.png` → Já existe na pasta `images/` (usar diretamente - ícone Free Fire)
- `/placeholder-icon-c.png` → Ícone do segundo jogo (ex: `images/icon_c.png`)

---

### 7. Ícone Free Fire (Banner FF)

**Linha 119 em CheckoutGarena.tsx:**
```tsx
<img src="/icon.png" alt="Compra 100% segura" />
```
**Substituir por:**
- `/icon.png` → Já existe na pasta `images/` (usar diretamente)

---

### 8. Pacote de Armas

**Linha 135 em CheckoutGarena.tsx:**
```tsx
<img src="/pacote-armas.png" alt="Pacote de Armas Armadura Aprimorada" />
```
**Substituir por:**
- `/pacote-armas.png` → Já existe na pasta `images/` (usar diretamente)

---

### 9. Ícones de Redes Sociais (4 imagens)

**Linhas 167-170 em CheckoutGarena.tsx:**
```tsx
<a href="#"><img src="/placeholder-ic-fb.svg" alt="Facebook" /></a>
<a href="#"><img src="/placeholder-ic-google.svg" alt="Google Play" /></a>
<a href="#"><img src="/placeholder-ic-twitter.svg" alt="Twitter" /></a>
<a href="#"><img src="/placeholder-ic-vk.svg" alt="VK" /></a>
```
**Substituir por:**
- `/placeholder-ic-fb.svg` → Ícone Facebook (ex: `images/ic-fb-485c92b0.svg`)
- `/placeholder-ic-google.svg` → Ícone Google Play (ex: `images/ic-google-d2ceaa95.svg`)
- `/placeholder-ic-twitter.svg` → Ícone Twitter (ex: `images/ic-twitter-92527e61.svg`)
- `/placeholder-ic-vk.svg` → Ícone VK (ex: `images/ic-vk-abadf989.svg`)

---

### 10. Ícone de Crédito/Diamantes

**Linha 181 em CheckoutGarena.tsx:**
```tsx
<img src="/placeholder-credit-icon.png" alt="Diamantes" width="22" />
```
**Substituir por:**
- `/placeholder-credit-icon.png` → Ícone de diamantes/créditos (ex: `images/credit_icon_large.png`)

---

## Resumo Total de Imagens

| Placeholder | Imagem Real Sugerida | Status |
|-------------|---------------------|--------|
| `/placeholder-logo-mobile.svg` | `images/logo_mobile.svg` | Substituir |
| `/placeholder-logo.svg` | `images/logo.svg` | Substituir |
| `/placeholder-avatar.svg` | `images/avatar.svg` | Substituir |
| `/banner.png` | `/banner.png` (images) | ✅ OK |
| `/banner_02.png` | `/banner_02.png` (images) | ✅ OK |
| `/banner_03.png` | `/banner_03.png` (images) | ✅ OK |
| `/placeholder-cover.svg` | `images/cover.svg` | Substituir |
| `/placeholder-cover-mobile.svg` | `images/cover_mobile.svg` | Substituir |
| `/placeholder-check.svg` | `images/check.svg` | Substituir |
| `/icon.png` | `/icon.png` (images) | ✅ OK |
| `/placeholder-icon-c.png` | `images/icon_c.png` | Substituir |
| `/pacote-armas.png` | `/pacote-armas.png` (images) | ✅ OK |
| `/placeholder-ic-fb.svg` | `images/ic-fb-*.svg` | Substituir |
| `/placeholder-ic-google.svg` | `images/ic-google-*.svg` | Substituir |
| `/placeholder-ic-twitter.svg` | `images/ic-twitter-*.svg` | Substituir |
| `/placeholder-ic-vk.svg` | `images/ic-vk-*.svg` | Substituir |
| `/placeholder-credit-icon.png` | `images/credit_icon_large.png` | Substituir |

**Total:** 17 imagens (4 já estão OK, 13 precisam ser substituídas)

---

## Como Substituir

### Método 1: Copiar arquivos para `/images/`

1. Coloque todas as imagens reais na pasta `/images/` do projeto
2. Atualize os caminhos no arquivo `/src/pages/CheckoutGarena.tsx`
3. Use caminhos absolutos começando com `/` (ex: `/logo.svg`)

### Método 2: Usar find & replace

1. Abra `/src/pages/CheckoutGarena.tsx`
2. Procure por "placeholder-" e substitua pelos nomes reais
3. Exemplo: `placeholder-logo.svg` → `logo.svg`

---

## Navegação

O botão **"Compre agora"** na página `RechargeResultPage` agora navega para este novo checkout Garena.

O fluxo completo é:
1. Quiz → Final Page
2. Final Page → Recharge Result Page
3. Recharge Result Page → **Checkout Garena** (novo)

---

## Observações Técnicas

- O checkout usa **Slick Carousel** (carregado via CDN) para o carrossel de banners
- O layout é **100% responsivo** (mobile-first)
- Cores fiéis ao original: vermelho `#E6252A`, laranja `#FF9800`
- Validação de ID com máscara (6-12 dígitos numéricos)
- Loader animado durante processo de login
- Todos os comportamentos são **front-end only** (sem chamadas de API)

---

**Data de criação:** 2024-11-13
**Versão:** 1.0
