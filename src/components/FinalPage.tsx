interface FinalPageProps {
  onCheckout: () => void;
}

export default function FinalPage({ onCheckout }: FinalPageProps) {
  return (
    <div className="text-center animate-fade-in">
      <div className="w-full h-3 bg-gradient-to-r from-gray-800 to-yellow-500 rounded-full mb-4" />

      <h2 className="text-lg font-bold text-yellow-500 mb-4">
        <em>🔥 Parabéns, guerreiro! Você mostrou que entende tudo de Free Fire! 🔥</em>
      </h2>

      <img
        src="/images/diamantes.png"
        alt="Troféu"
        className="w-40 mx-auto mb-6"
      />

      <h3 className="text-lg font-bold text-gray-800 mb-2">
        🎁 <span className="text-red-600">Cupom aplicado</span> <strong>(90% de desconto em diamantes!)</strong>
      </h3>

      <p className="text-base text-gray-800 mb-6">
        💎 Como recompensa, aqui está o seu <strong>CUPOM EXCLUSIVO</strong> para comprar diamantes e <strong>garantir os melhores itens do evento de aniversário de 8 anos Free Fire!</strong>
      </p>

      <button
        onClick={onCheckout}
        className="w-full bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg hover:bg-yellow-600 transition-all border-2 border-yellow-600"
      >
        RESGATAR CUPOM
      </button>
    </div>
  );
}
