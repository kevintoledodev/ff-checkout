interface IntroPageProps {
  onStart: () => void;
}

export default function IntroPage({ onStart }: IntroPageProps) {
  return (
    <div className="text-center animate-fade-in">
      <img
        src="images/free fire2.png"
        alt="Free Fire Banner"
        className="w-full mb-4 rounded"
      />

      <img
        src="images/8 anos ff.webp"
        alt="8 Anos Free Fire"
        className="w-80 mx-auto mb-6"
      />

      <h1 className="text-2xl font-bold text-yellow-500 mb-4">
        🎉 Comemore junto com a gente em grande estilo!
      </h1>

      <p className="text-base mb-4 text-gray-800">
        O Free Fire está celebrando seu <strong>8º aniversário</strong> com o lançamento de um novo mapa chamado <strong>Solara</strong>, que marca o primeiro cenário inédito em três anos.
      </p>

      <p className="text-sm mb-4 text-gray-700">
        E para você celebrar essa <strong>semana especial</strong> conosco, a Garena está liberando um presente exclusivo para nossa comunidade!
      </p>

      <p className="text-sm mb-4 text-gray-700">
        💎Mostre seu conhecimento no jogo e desbloqueie um <strong>CUPOM ESPECIAL 8º ANIVERSÁRIO de 90% de desconto</strong> para comprar diamantes!
      </p>

      <p className="text-sm mb-4 text-gray-700">
        O desafio é limitado apenas uma vez nesse acesso, caso feche o site, <strong>perderá sua chance!</strong>
      </p>

      <p className="text-xs mb-6 text-gray-600">
        ⚡ Vai perder essa oportunidade? Participe agora e celebre junto com a gente!!⚡
      </p>

      <button
        onClick={onStart}
        className="w-full bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg hover:bg-yellow-600 transition-all animate-pulse"
      >
        INICIAR DESAFIO
      </button>
    </div>
  );
}
