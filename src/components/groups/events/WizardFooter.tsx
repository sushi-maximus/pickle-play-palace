
import { Button } from "@/components/ui/button";

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  canGoNext: boolean;
  isLoading?: boolean;
}

export const WizardFooter = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onCancel,
  canGoNext,
  isLoading = false
}: WizardFooterProps) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {!isFirstStep && (
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isLoading}
              className="min-h-[48px] px-6"
            >
              Back
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="min-h-[48px] px-6 text-gray-600"
          >
            Cancel
          </Button>
        </div>
        
        <Button
          onClick={onNext}
          disabled={!canGoNext || isLoading}
          className="min-h-[48px] px-8 bg-primary hover:bg-primary/90"
        >
          {isLastStep ? "Confirm" : "Next"}
        </Button>
      </div>
    </div>
  );
};
