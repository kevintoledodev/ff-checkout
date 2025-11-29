interface ErrorPageProps {
  onRetry: () => void;
}

export default function ErrorPage({ onRetry }: ErrorPageProps) {
  return (
    <div className="text-center animate-fade-in">
      <img
        src="images/303797e9-0d2d-40dd-a926-d0a36e6345b0.jpg"
        alt="Erro"
        className="w-48 mx-auto mb-6"
      />

      <h2 className="text-xl font-bold text-red-600 mb-2">
        Vishh... Você Errou.
      </h2>

      <p className="text-gray-800 font-bold mb-6">
        Você possui mais tentativas
      </p>

      <button
        onClick={onRetry}
        className="w-full bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg hover:bg-yellow-600 transition-all"
      >
        Tentar Novamente.
      </button>
    </div>
  );
}
