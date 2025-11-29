import { Product } from '../../types/checkout';
import { formatCurrency } from '../../utils/validators';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface OrderSummaryProps {
  products: Product[];
  shipping: number;
  discount: number;
  couponCode?: string;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveProduct: (productId: string) => void;
}

export default function OrderSummary({
  products,
  shipping,
  discount,
  couponCode,
  onUpdateQuantity,
  onRemoveProduct,
}: OrderSummaryProps) {
  const subtotal = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
  const total = subtotal + shipping - discount;

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6 h-fit sticky top-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Resumo do Pedido</h2>

      <div className="space-y-4 mb-6">
        {products.map((product) => (
          <div key={product.id} className="flex gap-4 pb-4 border-b border-gray-200">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            />

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>

              {product.bonus && (
                <p className="text-xs font-semibold text-orange-600 mb-2">+ {product.bonus}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                  <button
                    onClick={() => onUpdateQuantity(product.id, Math.max(1, product.quantity - 1))}
                    className="p-1 hover:bg-gray-100 rounded-l-lg transition-colors"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="text-sm font-semibold px-2">{product.quantity}</span>

                  <button
                    onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}
                    className="p-1 hover:bg-gray-100 rounded-r-lg transition-colors"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={() => onRemoveProduct(product.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  aria-label="Remover produto"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mt-2 text-right">
                {product.originalPrice && product.originalPrice > product.price && (
                  <p className="text-xs text-gray-400 line-through">
                    {formatCurrency(product.originalPrice * product.quantity)}
                  </p>
                )}
                <p className="text-sm font-bold text-gray-800">
                  {formatCurrency(product.price * product.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-semibold text-gray-800">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Frete:</span>
          <span className="font-semibold text-gray-800">
            {shipping === 0 ? 'Grátis' : formatCurrency(shipping)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">
              Desconto {couponCode && `(${couponCode})`}:
            </span>
            <span className="font-semibold text-green-600">-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="pt-3 border-t-2 border-gray-300">
          <div className="flex justify-between">
            <span className="text-lg font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-orange-600">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        <p className="font-semibold mb-1">Pagamento Seguro</p>
        <p>Seus dados estão protegidos com criptografia SSL de 256 bits.</p>
      </div>
    </div>
  );
}
