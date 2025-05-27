
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed top-[58px] left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 py-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Step {currentStep}</span>
          <span>{currentStep} of {totalSteps}</span>
        </div>
      </div>
    </div>
  );
};
