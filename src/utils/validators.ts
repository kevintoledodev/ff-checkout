export const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, '');

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
};

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};




export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[^\d]/g, '');
  return cleaned.length === 11 && cleaned[2] === '9';
};

export const validateCEP = (cep: string): boolean => {
  const cleaned = cep.replace(/[^\d]/g, '');
  return cleaned.length === 8;
};

export const validateBirthDate = (date: string): boolean => {
  if (!date || date.length !== 10) return false;

  const [day, month, year] = date.split('/').map(Number);

  if (!day || !month || !year) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  if (month < 1 || month > 12) return false;

  const lastDay = new Date(year, month, 0).getDate();
  return day >= 1 && day <= lastDay;
};


export const formatCPF = (value: string): string => {
  const cleaned = value.replace(/[^\d]/g, '');
  const limited = cleaned.slice(0, 11);

  if (limited.length <= 3) return limited;
  if (limited.length <= 6) return `${limited.slice(0, 3)}.${limited.slice(3)}`;
  if (limited.length <= 9) return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
  return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
};

export const formatPhone = (value: string) => {
  if (!value) return "";

  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length === 0) return "";

  // (XX)
  if (cleaned.length <= 2) {
    return `(${cleaned}`;
  }

  // (XX) XXXXX-XXXX
  if (cleaned.length <= 7) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  }

  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

export const formatCEP = (value: string): string => {
  const cleaned = value.replace(/[^\d]/g, '');
  const limited = cleaned.slice(0, 8);

  if (limited.length <= 5) return limited;
  return `${limited.slice(0, 5)}-${limited.slice(5)}`;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/[^\d]/g, '');
  const limited = cleaned.slice(0, 16);
  const groups = limited.match(/.{1,4}/g);
  return groups ? groups.join(' ') : limited;
};

export const formatCardExpiry = (value: string): string => {
  const cleaned = value.replace(/[^\d]/g, '');
  const limited = cleaned.slice(0, 4);

  if (limited.length <= 2) return limited;
  return `${limited.slice(0, 2)}/${limited.slice(2)}`;
};

export const formatCardCVV = (value: string): string => {
  return value.replace(/[^\d]/g, '').slice(0, 4);
};

export const getCardBrand = (number: string): string => {
  const cleaned = number.replace(/[^\d]/g, '');

  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';
  if (/^35/.test(cleaned)) return 'jcb';
  if (/^(?:2131|1800|636)/.test(cleaned)) return 'diners';
  if (/^50/.test(cleaned)) return 'aura';
  if (/^606282/.test(cleaned)) return 'hipercard';
  if (/^(?:606282|3841)/.test(cleaned)) return 'elo';

  return 'unknown';
};
