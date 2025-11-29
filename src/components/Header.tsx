interface HeaderProps {
  logo: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function Header({ logo, showBackButton = false, onBack }: HeaderProps) {
  return (
    <header className="w-full mb-4">
      <div className="flex items-center justify-center relative">
        {showBackButton && (
          <button
            onClick={onBack}
            className="absolute left-0 text-gray-600 hover:text-gray-800"
          >
            ← Voltar
          </button>
        )}
        <img
          src={logo}
          alt="Logo"
          className="h-16 w-auto object-contain"
        />
      </div>
    </header>
  );
}
