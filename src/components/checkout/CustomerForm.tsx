import { useState, useEffect } from 'react';
import { CustomerData } from '../../types/checkout';
import {
  formatCPF,
  formatPhone,
  formatCEP,
  validateCPF,
  validateEmail,
  validatePhone,
  validateCEP,
} from '../../utils/validators';
import { fetchAddressByCEP } from '../../services/checkoutService';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface CustomerFormProps {
  data: CustomerData;
  onChange: (data: CustomerData) => void;
  errors: Partial<Record<keyof CustomerData, string>>;
  onValidate: (field: keyof CustomerData, isValid: boolean) => void;
}

export default function CustomerForm({ data, onChange, errors, onValidate }: CustomerFormProps) {
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [cepSuccess, setCepSuccess] = useState(false);

  const handleChange = (field: keyof CustomerData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleCPFChange = (value: string) => {
    const formatted = formatCPF(value);
    handleChange('cpf', formatted);

    if (formatted.replace(/[^\d]/g, '').length === 11) {
      const isValid = validateCPF(formatted);
      onValidate('cpf', isValid);
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    handleChange('phone', formatted);

    if (formatted.replace(/[^\d]/g, '').length === 11) {
      const isValid = validatePhone(formatted);
      onValidate('phone', isValid);
    }
  };

  const handleCEPChange = (value: string) => {
    const formatted = formatCEP(value);
    handleChange('cep', formatted);
    setCepSuccess(false);
  };

  const handleCEPBlur = async () => {
    if (!validateCEP(data.cep)) {
      onValidate('cep', false);
      return;
    }

    setLoadingCEP(true);
    const address = await fetchAddressByCEP(data.cep);

    if (address) {
      onChange({
        ...data,
        street: address.logradouro,
        neighborhood: address.bairro,
        city: address.localidade,
        state: address.uf,
        complement: address.complemento || data.complement,
      });
      setCepSuccess(true);
      onValidate('cep', true);
    } else {
      onValidate('cep', false);
    }

    setLoadingCEP(false);
  };

  const handleEmailBlur = () => {
    if (data.email) {
      const isValid = validateEmail(data.email);
      onValidate('email', isValid);
    }
  };

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Dados Pessoais</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              id="fullName"
              type="text"
              value={data.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="João da Silva"
              required
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <XCircle size={12} /> {errors.fullName}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cpf" className="block text-sm font-semibold text-gray-700 mb-2">
                CPF *
              </label>
              <input
                id="cpf"
                type="text"
                value={data.cpf}
                onChange={(e) => handleCPFChange(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                  errors.cpf ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
              {errors.cpf && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <XCircle size={12} /> {errors.cpf}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Celular *
              </label>
              <input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="(11) 99999-9999"
                maxLength={15}
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <XCircle size={12} /> {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              E-mail *
            </label>
            <input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={handleEmailBlur}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="seuemail@exemplo.com"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <XCircle size={12} /> {errors.email}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Endereço de Cobrança</h2>

        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="cep" className="block text-sm font-semibold text-gray-700 mb-2">
              CEP *
            </label>
            <div className="relative">
              <input
                id="cep"
                type="text"
                value={data.cep}
                onChange={(e) => handleCEPChange(e.target.value)}
                onBlur={handleCEPBlur}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all pr-10 ${
                  errors.cep ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="00000-000"
                maxLength={9}
                required
              />
              {loadingCEP && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 size={20} className="animate-spin text-orange-500" />
                </div>
              )}
              {cepSuccess && !loadingCEP && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 size={20} className="text-green-500" />
                </div>
              )}
            </div>
            {errors.cep && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <XCircle size={12} /> {errors.cep}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Digite o CEP para preenchimento automático
            </p>
          </div>

          <div>
            <label htmlFor="street" className="block text-sm font-semibold text-gray-700 mb-2">
              Logradouro *
            </label>
            <input
              id="street"
              type="text"
              value={data.street}
              onChange={(e) => handleChange('street', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                errors.street ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Rua, Avenida, etc."
              required
            />
            {errors.street && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <XCircle size={12} /> {errors.street}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="number" className="block text-sm font-semibold text-gray-700 mb-2">
                Número *
              </label>
              <input
                id="number"
                type="text"
                value={data.number}
                onChange={(e) => handleChange('number', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                  errors.number ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123"
                required
              />
              {errors.number && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <XCircle size={12} /> {errors.number}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="complement" className="block text-sm font-semibold text-gray-700 mb-2">
                Complemento
              </label>
              <input
                id="complement"
                type="text"
                value={data.complement}
                onChange={(e) => handleChange('complement', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                placeholder="Apto, Bloco, etc."
              />
            </div>
          </div>

          <div>
            <label htmlFor="neighborhood" className="block text-sm font-semibold text-gray-700 mb-2">
              Bairro *
            </label>
            <input
              id="neighborhood"
              type="text"
              value={data.neighborhood}
              onChange={(e) => handleChange('neighborhood', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                errors.neighborhood ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Centro"
              required
            />
            {errors.neighborhood && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <XCircle size={12} /> {errors.neighborhood}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                Cidade *
              </label>
              <input
                id="city"
                type="text"
                value={data.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="São Paulo"
                required
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <XCircle size={12} /> {errors.city}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                Estado *
              </label>
              <select
                id="state"
                value={data.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Selecione</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <XCircle size={12} /> {errors.state}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
