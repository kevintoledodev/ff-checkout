interface ProgressBarProps {
  percentage: number;
}

export default function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="w-full mb-4">
      <div className="w-full h-3 bg-black rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gray-800 to-yellow-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
