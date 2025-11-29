import { useState } from 'react';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import DiscountBadge from './components/DiscountBadge';
import IntroPage from './components/IntroPage';
import QuizPage from './components/QuizPage';
import ErrorPage from './components/ErrorPage';
import BreakPage from './components/BreakPage';
import CouponPage from './components/CouponPage';
import LoadingPage from './components/LoadingPage';
import FinalPage from './components/FinalPage';
import CheckoutGarena from './pages/CheckoutGarena';
import CheckoutPage from './components/checkout/CheckoutPage';
import { quizData } from './data/quizData';


import "./styles/style.css";


type PageType = 'intro' | 'break1' | 'quiz' | 'error' | 'coupon' | 'loading' | 'final' | 'checkout-garena' | 'checkout-page';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('intro');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [previousPage, setPreviousPage] = useState<PageType>('intro');

  const currentStep = quizData.steps[currentStepIndex];

  const handleStart = () => {
    setCurrentPage('break1');
  };

  const handleBreakContinue = () => {
    setCurrentPage('quiz');
    setCurrentStepIndex(0);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setDiscount(currentStep.discount);

      if (currentStep.nextPageId === 'loading') {
        setCurrentPage('loading');
      } else if (currentStep.nextPageId === 'coupon') {
        setCurrentPage('coupon');
      } else {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < quizData.steps.length) {
          setCurrentStepIndex(nextIndex);
        }
      }
    } else {
      setPreviousPage('quiz');
      setCurrentPage('error');
    }
  };

  const handleRetry = () => {
    setCurrentPage('quiz');
  };

  const handleCouponContinue = () => {
    setCurrentStepIndex(3);
    setCurrentPage('quiz');
  };

  const handleLoadingComplete = () => {
    setCurrentPage('final');
  };


  const handleCheckoutGarena = () => {
    setCurrentPage('checkout-garena');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'intro':
        return <IntroPage onStart={handleStart} />;

      case 'break1':
        return <BreakPage discount={discount} onContinue={handleBreakContinue} />;

      case 'quiz':
        return (
          <>
            <ProgressBar percentage={currentStep.progress} />
            <DiscountBadge discount={currentStep.discount} />
            <QuizPage
              title={currentStep.title}
              subtitle={currentStep.subtitle}
              options={currentStep.options}
              type={currentStep.type}
              columns={currentStep.columns}
              onAnswer={handleAnswer}
            />
          </>
        );

      case 'error':
        return <ErrorPage onRetry={handleRetry} />;

      case 'coupon':
        return (
          <>
            <ProgressBar percentage={60} />
            <CouponPage onContinue={handleCouponContinue} />
          </>
        );

      case 'loading':
        return (
          <>
            <ProgressBar percentage={100} />
            <LoadingPage onComplete={handleLoadingComplete} />
          </>
        );

      case 'final':
        return <FinalPage onCheckout={handleCheckoutGarena} />;

  

      case 'checkout-garena':
       return <CheckoutGarena onGoToCheckoutPage={() => setCurrentPage("checkout-page")}/>;


      case 'checkout-page':
        return <CheckoutPage />;

      default:
        return <IntroPage onStart={handleStart} />;
    }
  };

  const showHeader = currentPage !== 'intro' && currentPage !== 'checkout-garena';
  const showBackButton = false;

  if (currentPage === 'checkout-garena') {
    return renderPage();
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5 py-7">
      <main className="w-full min-w-80 max-w-lg flex flex-col gap-8">
        {showHeader && (
          <Header
            logo={quizData.logo}
            showBackButton={showBackButton}
          />
        )}
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
