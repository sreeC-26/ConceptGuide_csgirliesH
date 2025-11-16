import { useState } from 'react';
import LearningCard from './LearningCard';

export default function RepairPath({ steps, onComplete, onProgressUpdate }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [sharedAnswers, setSharedAnswers] = useState({}); // Store answers across steps

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      // Notify parent of progress change
      if (onProgressUpdate) {
        onProgressUpdate(currentStepIndex - 1, steps.length);
      }
    }
  };

  const handleMarkComplete = () => {
    if (isLastStep) {
      // All steps completed
      if (onProgressUpdate) {
        onProgressUpdate(steps.length - 1, steps.length);
      }
      if (onComplete) {
        onComplete();
      }
    } else {
      // Move to next step
      setCurrentStepIndex((prev) => prev + 1);
      if (onProgressUpdate) {
        onProgressUpdate(currentStepIndex + 1, steps.length);
      }
    }
  };

  const handleAnswerChange = (stepNumber, answer) => {
    setSharedAnswers((prev) => ({
      ...prev,
      [stepNumber]: answer
    }));
  };

  return (
    <div className="gradient-border rounded-lg p-6">
      <div className="window-controls mb-4">
        <div className="window-dot window-dot-red"></div>
        <div className="window-dot window-dot-yellow"></div>
        <div className="window-dot window-dot-green"></div>
      </div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl flex items-center" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', fontSize: '2rem' }}>
            <span className="mr-2">🎓</span>
            Personalized Learning Path
          </h2>
          <span className="text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>
            Step {currentStepIndex + 1} of {steps.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full rounded-full h-2.5 mb-4" style={{ backgroundColor: '#1A1A1A' }}>
          <div
            className="h-2.5 rounded-full transition-all duration-300"
            style={{ 
              width: `${progress}%`,
              background: 'linear-gradient(135deg, #FF4081 0%, #E0007A 100%)'
            }}
          ></div>
        </div>

        {/* Step indicators */}
        <div className="flex gap-2 justify-center flex-wrap">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                index < currentStepIndex
                  ? 'text-white'
                  : index === currentStepIndex
                  ? 'text-white ring-2'
                  : 'text-gray-600'
              }`}
              style={{
                backgroundColor: index < currentStepIndex ? '#27C93F' : index === currentStepIndex ? '#FF4081' : '#2D2D2D',
                border: index === currentStepIndex ? '2px solid #E0007A' : 'none',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1rem'
              }}
            >
              {index < currentStepIndex ? '✓' : index + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        {!isFirstStep && (
          <button
            onClick={handlePrevious}
            className="btn-secondary flex-1"
          >
            ← Previous Step
          </button>
        )}
        <div className={isFirstStep ? 'flex-1' : 'hidden'}></div>
      </div>

      {currentStep && (
        <LearningCard
          key={currentStep.stepNumber} // Force remount when step changes
          step={currentStep}
          onMarkComplete={handleMarkComplete}
          isLastStep={isLastStep}
          sharedAnswer={sharedAnswers[currentStep.stepNumber] || undefined}
          onAnswerChange={(answer) => handleAnswerChange(currentStep.stepNumber, answer)}
        />
      )}
    </div>
  );
}
