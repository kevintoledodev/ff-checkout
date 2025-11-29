interface QuizOption {
  id: string;
  title: string;
  image?: string;
  emoji?: string;
  isCorrect?: boolean;
}

interface QuizPageProps {
  title: string;
  subtitle: string;
  options: QuizOption[];
  type: 'text-only' | 'text-image' | 'text-emoji';
  columns: string;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuizPage({ title, subtitle, options, type, columns, onAnswer }: QuizPageProps) {
  const handleClick = (option: QuizOption) => {
    onAnswer(option.isCorrect || false);
  };

  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-lg font-bold text-yellow-500 mb-2">{title}</h2>
      <div
        className="text-sm font-bold text-gray-800 mb-6"
        dangerouslySetInnerHTML={{ __html: subtitle }}
      />

      <div className={`grid ${columns} gap-4`}>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleClick(option)}
            className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-yellow-500 hover:shadow-lg transition-all cursor-pointer"
          >
            {type === 'text-image' && option.image && (
              <img
                src={option.image}
                alt={option.title}
                className="w-full h-32 object-cover rounded mb-3"
              />
            )}

            {type === 'text-emoji' && (
              <div className="flex items-center gap-3">
                <span className="text-4xl">{option.emoji}</span>
                <p className="text-left font-bold text-gray-800 flex-1">{option.title}</p>
              </div>
            )}

            {type === 'text-only' && (
              <p className="font-bold text-gray-800 text-lg">{option.title}</p>
            )}

            {type === 'text-image' && (
              <p className="font-bold text-gray-800">{option.title}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
