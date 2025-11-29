import { useState } from 'react';
import { validateCoupon } from '../../services/checkoutService';
import { Loader2, CheckCircle2, XCircle, Tag } from 'lucide-react';

interface CouponInputProps {
  onApply: (code: string, discountAmount: number) => void;
  onRemove: () => void;
  appliedCoupon?: string;
  subtotal: number;
}

export default function CouponInput({ onApply, onRemove, appliedCoupon, subtotal }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Digite um código de cupom');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const result = await validateCoupon(couponCode.trim());

    setLoading(false);

    if (result.valid) {
      let discountAmount = 0;

      if (result.discountPercentage) {
        discountAmount = (subtotal * result.discountPercentage) / 100;
      } else if (result.discountAmount) {
        discountAmount = result.discountAmount;
      }

      onApply(couponCode.trim().toUpperCase(), discountAmount);
      setSuccess(result.message || 'Cupom aplicado com sucesso!');
      setCouponCode('');
    } else {
      setError(result.message || 'Cupom inválido ou expirado');
    }
  };

  const handleRemoveCoupon = () => {
    onRemove();
    setSuccess('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApplyCoupon();
    }
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-800">Cupom aplicado!</p>
              <p className="text-xs text-green-700">Código: {appliedCoupon}</p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-green-600 hover:text-green-800 transition-colors text-sm font-semibold"
          >
            Remover
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Tag size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value.toUpperCase());
              setError('');
              setSuccess('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="Digite o código do cupom"
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleApplyCoupon}
          disabled={loading || !couponCode.trim()}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Validando...
            </>
          ) : (
            'Aplicar'
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm animate-fade-in">
          <XCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-green-600 text-sm animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Possui um cupom de desconto? Digite acima para aplicar
      </p>
    </div>
  );
}
