
import { useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WizardHeader } from "./WizardHeader";
import { WizardFooter } from "./WizardFooter";
import { StepIndicator } from "./StepIndicator";
import { wizardReducer, initialWizardState } from "./hooks/useWizardState";
import type { WizardStep } from "./types";

export const EventCreationWizard = () => {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);

  if (!groupId) {
    navigate('/groups');
    return null;
  }

  const handleNext = () => {
    if (state.currentStep < 6) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const handleBack = () => {
    if (state.currentStep > 1) {
      dispatch({ type: 'PREVIOUS_STEP' });
    }
  };

  const handleCancel = () => {
    navigate(`/groups/${groupId}`);
  };

  const getStepTitle = (step: number): string => {
    const titles = {
      1: "Event Format",
      2: "Event Type", 
      3: "Event Details",
      4: "Player Details",
      5: "Ranking Details",
      6: "Review and Confirm"
    };
    return titles[step as keyof typeof titles] || "Event Creation";
  };

  const renderCurrentStep = () => {
    // Step components will be implemented in Phase 3
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Step {state.currentStep}: {getStepTitle(state.currentStep)}
          </h2>
          <p className="text-gray-600">
            Step component will be implemented in Phase 3
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <WizardHeader 
        currentStep={state.currentStep}
        totalSteps={6}
        title={getStepTitle(state.currentStep)}
      />
      
      <StepIndicator 
        currentStep={state.currentStep}
        totalSteps={6}
      />
      
      <div className="flex-1 pt-24 pb-20 px-3">
        {renderCurrentStep()}
      </div>
      
      <WizardFooter
        currentStep={state.currentStep}
        totalSteps={6}
        onBack={handleBack}
        onNext={handleNext}
        onCancel={handleCancel}
        canGoNext={true} // Will be dynamic based on validation in Phase 3
        isLoading={state.isLoading}
      />
    </div>
  );
};
