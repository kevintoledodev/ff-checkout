export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  bonus?: string;
}

export interface CustomerData {
  fullName: string;
  cpf: string;
  phone: string;
  email: string;
  birthDate: string;
  telegramId: "";
}

export interface PaymentMethod {
  type: 'pix' | 'credit_card' | 'boleto';
  cardData?: {
    number: string;
    holderName: string;
    expiry: string;
    cvv: string;
    saveCard: boolean;
  };
}

export interface Order {
  id?: string;
  products: Product[];
  customer: CustomerData;
  payment: PaymentMethod;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  utmParams?: Record<string, string>;
  createdAt?: string;
}

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface CouponValidationResponse {
  valid: boolean;
  discountPercentage?: number;
  discountAmount?: number;
  message?: string;
}

export interface PaymentResponse {
  success: boolean;
  orderId?: string;
  qrCode?: string;
  copyPaste?: string;
  boletoUrl?: string;
  message?: string;
}
