
import { useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WizardHeader } from "./WizardHeader";
import { WizardFooter } from "./WizardFooter";
import { StepIndicator } from "./StepIndicator";
import { EventFormatStep } from "./steps";
import { wizardReducer, initialWizardState } from "./hooks/useWizardState";
import type { WizardStep } from "./types";

export const EventCreationWizard = () => {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(wizardReducer, {
    ...initialWizardState,
    formData: {
      ...initialWizardState.formData,
      groupId: groupId || ""
    }
  });

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

  const handleFormDataUpdate = (data: any) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
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

  const validateCurrentStep = (): boolean => {
    switch (state.currentStep) {
      case 1:
        return !!state.formData.eventFormat;
      case 2:
        return !!state.formData.eventType;
      case 3:
        return !!(state.formData.eventTitle && state.formData.eventDate && state.formData.eventTime && state.formData.location);
      case 4:
        return state.formData.maxPlayers > 0;
      case 5:
        return !!(state.formData.rankingMethod && state.formData.skillCategory);
      case 6:
        return true;
      default:
        return false;
    }
  };

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <EventFormatStep
            value={state.formData.eventFormat}
            onChange={(eventFormat) => handleFormDataUpdate({ eventFormat })}
            error={state.validationErrors.eventFormat}
          />
        );
      
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                Step {state.currentStep}: {getStepTitle(state.currentStep)}
              </h2>
              <p className="text-gray-600">
                Step component will be implemented in next phase
              </p>
            </div>
          </div>
        );
    }
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
      
      <div className="flex-1 pt-24 pb-20">
        {renderCurrentStep()}
      </div>
      
      <WizardFooter
        currentStep={state.currentStep}
        totalSteps={6}
        onBack={handleBack}
        onNext={handleNext}
        onCancel={handleCancel}
        canGoNext={validateCurrentStep()}
        isLoading={state.isLoading}
      />
    </div>
  );
};
