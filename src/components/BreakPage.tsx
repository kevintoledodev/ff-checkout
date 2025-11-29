interface BreakPageProps {
  discount: number;
  onContinue: () => void;
}

export default function BreakPage({ discount, onContinue }: BreakPageProps) {
  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-xl font-bold text-yellow-500 mb-4">
        Você Sabia?
      </h2>

      <p className="text-sm mb-4 text-gray-800">
        <strong>📢 87% dos jogadores já perderam</strong> skins lendárias por não terem diamantes suficientes na hora certa!
      </p>

      <p className="text-sm mb-4 text-gray-800">
        💎 Mas hoje você tem a chance de mudar isso e garantir seus itens na <strong>SEMANA DO NOSSO 8º ANIVERSÁRIO!</strong>
      </p>

      <p className="text-sm mb-6 text-gray-800">
        ✅ <em>*Responda corretamente as perguntas a seguir para acumular <strong>cada vez mais desconto!</strong></em>
      </p>

      <button
        onClick={onContinue}
        className="w-full bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg hover:bg-yellow-600 transition-all animate-pulse"
      >
        👉 Continue o quiz para desbloquear seu CUPOM EXCLUSIVO!
      </button>
    </div>
  );
}
