export interface QuizOption {
  id: string;
  title: string;
  image?: string;
  emoji?: string;
  isCorrect?: boolean;
}

export interface QuizStep {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  discount: number;
  options: QuizOption[];
  type: 'text-only' | 'text-image' | 'text-emoji';
  columns: string;
  errorPageId?: string;
  nextPageId?: string;
}

export interface Page {
  id: string;
  type: 'intro' | 'quiz' | 'error' | 'break' | 'loading' | 'final' | 'checkout';
  slug: string;
}
