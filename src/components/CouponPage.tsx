interface CouponPageProps {
  onContinue: () => void;
}

export default function CouponPage({ onContinue }: CouponPageProps) {
  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-lg font-bold text-red-600 mb-4">
        <u>CUPOM RESERVADO</u>
      </h2>

      <p className="text-gray-800 font-bold text-lg mb-2">
        Você já concluiu <u>60%</u>!
      </p>

      <p className="text-lg font-bold text-gray-800 mb-4">
        Os <span className="text-yellow-500">Cupons</span> estão acabando.
      </p>

      <p className="text-sm text-gray-700 mb-6">
        Seu cupom será reservado <strong>durante 15 minutos</strong>. Responda antes do tempo acabar.
      </p>

      <div className="bg-black border-2 border-green-500 rounded-lg p-6 mb-6">
        <p className="text-yellow-500 font-bold mb-2">CUPONS RESTANTES</p>
        <div className="flex items-center justify-center gap-2 mb-2">
          {[1, 2, 3, 4].map((star) => (
            <span key={star} className="text-yellow-500 text-2xl">⭐</span>
          ))}
        </div>
        <p className="text-white text-sm">23 cupons disponíveis</p>
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg hover:bg-yellow-600 transition-all"
      >
        Continuar
      </button>
    </div>
  );
}
