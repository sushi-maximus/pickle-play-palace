
import { useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WizardHeader } from "./WizardHeader";
import { WizardFooter } from "./WizardFooter";
import { StepIndicator } from "./StepIndicator";
import { WizardStepRenderer } from "./components/WizardStepRenderer";
import { wizardReducer, initialWizardState } from "./hooks/useWizardState";
import { useEventSubmission } from "./hooks/useEventSubmission";
import { useStepValidation } from "./hooks/useStepValidation";

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

  const { handleEventSubmission } = useEventSubmission(groupId || "");
  const { validateCurrentStep, getValidationErrors } = useStepValidation();

  if (!groupId) {
    navigate('/groups');
    return null;
  }

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

  const getCurrentSelections = (): string => {
    const { formData } = state;
    const selections: string[] = [];

    if (formData.eventFormat) {
      const formatMap: Record<string, string> = {
        'tennis': 'Tennis',
        'pickleball': 'Pickleball',
        'padel': 'Padel',
        'racquetball': 'Racquetball',
        'table_tennis': 'Table Tennis',
        'squash': 'Squash',
        'basketball': 'Basketball',
        'soccer': 'Soccer',
        'golf': 'Golf',
        'other': 'Other'
      };
      selections.push(formatMap[formData.eventFormat] || formData.eventFormat);
    }

    if (formData.eventType === 'one-time') {
      selections.push('One-Time Event');
    } else if (formData.eventType === 'multi-week' && formData.seriesTitle) {
      selections.push(`Multi-Week: ${formData.seriesTitle}`);
    }

    return selections.join(' • ');
  };

  const handleNext = async () => {
    if (state.currentStep < 6) {
      // Add haptic feedback following mobile-first principles
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      dispatch({ type: 'NEXT_STEP' });
    } else if (state.currentStep === 6) {
      // Handle event creation on final step
      await handleEventSubmission(state.formData, dispatch);
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

  const onEventSubmission = () => handleEventSubmission(state.formData, dispatch);

  const currentSelections = getCurrentSelections();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <WizardHeader 
        currentStep={state.currentStep}
        totalSteps={6}
        title={getStepTitle(state.currentStep)}
      />
      
      {currentSelections && (
        <div className="fixed top-[58px] left-0 right-0 z-40 bg-white border-b border-gray-100">
          <div className="px-4 py-2">
            <p className="text-sm text-gray-600 text-center">{currentSelections}</p>
          </div>
        </div>
      )}
      
      <StepIndicator 
        currentStep={state.currentStep}
        totalSteps={6}
      />
      
      <div className="flex-1 pt-24 pb-20">
        <WizardStepRenderer
          currentStep={state.currentStep}
          formData={state.formData}
          validationErrors={state.validationErrors}
          onFormDataUpdate={handleFormDataUpdate}
          onEventSubmission={onEventSubmission}
          getValidationErrors={() => getValidationErrors(state.currentStep, state.formData)}
          isLoading={state.isLoading}
        />
      </div>
      
      <WizardFooter
        currentStep={state.currentStep}
        totalSteps={6}
        onBack={handleBack}
        onNext={handleNext}
        onCancel={handleCancel}
        canGoNext={validateCurrentStep(state.currentStep, state.formData)}
        isLoading={state.isLoading}
      />
    </div>
  );
};
