import { useEffect } from 'react';

interface LoadingPageProps {
  onComplete: () => void;
}

export default function LoadingPage({ onComplete }: LoadingPageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-xl font-bold text-yellow-500 mb-6">
        Quase lá...
      </h2>

      <div className="mb-6">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
      </div>

      <p className="text-lg font-bold text-gray-800 mb-2">
        Conferindo respostas...
      </p>

      <p className="text-sm text-gray-600 mb-8">
        Verificando e enviando ao servidor. Aguarde ser redirecionado.
      </p>

      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <img
            src="images/reclameaqui.jpg"
            alt="Reclame Aqui"
            className="w-16 h-16 rounded-full"
          />
          <div className="text-left flex-1">
            <p className="font-bold text-sm text-gray-800">RECLAME AQUI</p>
            <p className="text-xs text-gray-600">Melhores empresas no Reclame AQUI</p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-yellow-500">⭐</span>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-700">
          A empresa atingiu a reputação máxima no Reclame AQUI. Sua nota média nos últimos 6 meses é <strong>9.0/10.</strong> <strong>Reputação</strong>
        </p>
        <p className="text-sm font-bold text-green-600 mt-2">RA1000</p>
      </div>

      <div className="space-y-4">
        <TestimonialCard
          name="Ana P."
          location="São Paulo, SP"
          text="Fiz o quiz e consegui <strong>5.200 diamantes</strong> com <strong>90% de desconto</strong>! Super fácil e rápido!"
          rating={5}
        />
        <TestimonialCard
          name="Lucas M."
          location="Santos, SP"
          text="Achei que era fake, mas realmente funciona! Peguei meus <strong>5.200 + 1.120 diamantes bônus</strong> em minutos!"
          rating={5}
        />
        <TestimonialCard
          name="Gustavo R."
          location="Rio de Janeiro, RJ"
          text="Não acreditei no começo, mas fiz o quiz e realmente consegui os <strong>5.200 diamantes</strong> com o desconto! Agora meu Free Fire tá insano!"
          rating={5}
        />
      </div>
    </div>
  );
}

function TestimonialCard({ name, location, text, rating }: { name: string; location: string; text: string; rating: number }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
          {name[0]}
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-gray-800">{name}</p>
          <p className="text-xs text-gray-500">{location}</p>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: rating }).map((_, i) => (
              <span key={i} className="text-yellow-500 text-xs">⭐</span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}
