import { useState } from 'react';
import { PaymentMethod } from '../../types/checkout';
import {
  formatCardNumber,
  formatCardExpiry,
  formatCardCVV,
  getCardBrand,
} from '../../utils/validators';
import { CreditCard, QrCode, FileText, XCircle } from 'lucide-react';

interface PaymentMethodsProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  errors: Record<string, string>;
  onValidate: (field: string, isValid: boolean) => void;
}

export default function PaymentMethods({
  selectedMethod,
  onMethodChange,
  errors,
  onValidate,
}: PaymentMethodsProps) {
  const [cardBrand, setCardBrand] = useState<string>('unknown');

  const handleMethodTypeChange = (type: 'pix' | 'credit_card' | 'boleto') => {
    onMethodChange({ ...selectedMethod, type });
  };

  const handleCardChange = (field: keyof NonNullable<PaymentMethod['cardData']>, value: string) => {
    const cardData = selectedMethod.cardData || {
      number: '',
      holderName: '',
      expiry: '',
      cvv: '',
      saveCard: false,
    };

    let formattedValue = value;

    if (field === 'number') {
      formattedValue = formatCardNumber(value);
      const brand = getCardBrand(formattedValue);
      setCardBrand(brand);

      if (formattedValue.replace(/\s/g, '').length >= 13) {
        onValidate('cardNumber', formattedValue.replace(/\s/g, '').length >= 13);
      }
    } else if (field === 'expiry') {
      formattedValue = formatCardExpiry(value);

      if (formattedValue.length === 5) {
        const [month, year] = formattedValue.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        const isValid =
          parseInt(month) >= 1 &&
          parseInt(month) <= 12 &&
          (parseInt(year) > currentYear ||
            (parseInt(year) === currentYear && parseInt(month) >= currentMonth));

        onValidate('cardExpiry', isValid);
      }
    } else if (field === 'cvv') {
      formattedValue = formatCardCVV(value);

      if (formattedValue.length >= 3) {
        onValidate('cardCVV', true);
      }
    }

    onMethodChange({
      ...selectedMethod,
      cardData: { ...cardData, [field]: formattedValue },
    });
  };

  const cardBrandLogos: Record<string, string> = {
    visa: '💳 Visa',
    mastercard: '💳 Mastercard',
    amex: '💳 Amex',
    elo: '💳 Elo',
    hipercard: '💳 Hipercard',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Método de Pagamento</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => handleMethodTypeChange('pix')}
          className={`p-4 border-2 rounded-lg transition-all flex flex-col items-center gap-2 ${
            selectedMethod.type === 'pix'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-300 hover:border-orange-300'
          }`}
        >
          <QrCode size={32} className={selectedMethod.type === 'pix' ? 'text-orange-600' : 'text-gray-600'} />
          <span className="font-semibold text-sm">PIX</span>
          <span className="text-xs text-gray-500">Aprovação instantânea</span>
        </button>

        <button
          type="button"
          onClick={() => handleMethodTypeChange('credit_card')}
          className={`p-4 border-2 rounded-lg transition-all flex flex-col items-center gap-2 ${
            selectedMethod.type === 'credit_card'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-300 hover:border-orange-300'
          }`}
        >
          <CreditCard size={32} className={selectedMethod.type === 'credit_card' ? 'text-orange-600' : 'text-gray-600'} />
          <span className="font-semibold text-sm">Cartão de Crédito</span>
          <span className="text-xs text-gray-500">Parcelamento disponível</span>
        </button>

        <button
          type="button"
          onClick={() => handleMethodTypeChange('boleto')}
          className={`p-4 border-2 rounded-lg transition-all flex flex-col items-center gap-2 ${
            selectedMethod.type === 'boleto'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-300 hover:border-orange-300'
          }`}
        >
          <FileText size={32} className={selectedMethod.type === 'boleto' ? 'text-orange-600' : 'text-gray-600'} />
          <span className="font-semibold text-sm">Boleto</span>
          <span className="text-xs text-gray-500">Vencimento em 3 dias</span>
        </button>
      </div>

      {selectedMethod.type === 'pix' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Pagamento via PIX:</strong>
          </p>
          <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
            <li>Aprovação instantânea após o pagamento</li>
            <li>QR Code gerado na próxima etapa</li>
            <li>Válido por 30 minutos</li>
          </ul>
        </div>
      )}

      {selectedMethod.type === 'credit_card' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-semibold text-gray-700 mb-2">
              Número do Cartão *
            </label>
            <div className="relative">
              <input
                id="cardNumber"
                type="text"
                value={selectedMethod.cardData?.number || ''}
                onChange={(e) => handleCardChange('number', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                required
              />
              {cardBrand !== 'unknown' && cardBrandLogos[cardBrand] && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                  {cardBrandLogos[cardBrand]}
                </div>
              )}
            </div>
            {errors.cardNumber && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <XCircle size={12} /> {errors.cardNumber}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="cardHolder" className="block text-sm font-semibold text-gray-700 mb-2">
              Nome do Titular *
            </label>
            <input
              id="cardHolder"
              type="text"
              value={selectedMethod.cardData?.holderName || ''}
              onChange={(e) => handleCardChange('holderName', e.target.value.toUpperCase())}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                errors.cardHolder ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="NOME COMO NO CARTÃO"
              required
            />
            {errors.cardHolder && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <XCircle size={12} /> {errors.cardHolder}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cardExpiry" className="block text-sm font-semibold text-gray-700 mb-2">
                Validade *
              </label>
              <input
                id="cardExpiry"
                type="text"
                value={selectedMethod.cardData?.expiry || ''}
                onChange={(e) => handleCardChange('expiry', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                  errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="MM/AA"
                maxLength={5}
                required
              />
              {errors.cardExpiry && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <XCircle size={12} /> {errors.cardExpiry}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cardCVV" className="block text-sm font-semibold text-gray-700 mb-2">
                CVV *
              </label>
              <input
                id="cardCVV"
                type="text"
                value={selectedMethod.cardData?.cvv || ''}
                onChange={(e) => handleCardChange('cvv', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                  errors.cardCVV ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123"
                maxLength={4}
                required
              />
              {errors.cardCVV && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <XCircle size={12} /> {errors.cardCVV}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="saveCard"
              type="checkbox"
              checked={selectedMethod.cardData?.saveCard || false}
              onChange={(e) =>
                onMethodChange({
                  ...selectedMethod,
                  cardData: {
                    ...(selectedMethod.cardData || {
                      number: '',
                      holderName: '',
                      expiry: '',
                      cvv: '',
                      saveCard: false,
                    }),
                    saveCard: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="saveCard" className="text-sm text-gray-700">
              Salvar cartão para futuras compras
            </label>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600">
              Seus dados de pagamento são criptografados e processados de forma segura. Não armazenamos informações completas do cartão.
            </p>
          </div>
        </div>
      )}

      {selectedMethod.type === 'boleto' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 mb-2">
            <strong>Pagamento via Boleto:</strong>
          </p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
            <li>Boleto gerado após finalizar o pedido</li>
            <li>Prazo de pagamento: 3 dias úteis</li>
            <li>Aprovação em até 2 dias úteis após o pagamento</li>
            <li>Você receberá o boleto por e-mail</li>
          </ul>
        </div>
      )}
    </div>
  );
}
