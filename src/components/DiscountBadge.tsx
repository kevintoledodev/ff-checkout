interface DiscountBadgeProps {
  discount: number;
}

export default function DiscountBadge({ discount }: DiscountBadgeProps) {
  return (
    <div className="text-center mb-6">
      <div className="inline-block bg-black border-2 border-yellow-500 rounded-lg px-6 py-3">
        <p className="text-yellow-500 font-bold text-sm mb-1">DESCONTO</p>
        <p className="text-yellow-500 font-bold text-3xl">{discount}%</p>
        <p className="text-white font-bold text-sm mt-1">Acumulado</p>
      </div>
    </div>
  );
}
