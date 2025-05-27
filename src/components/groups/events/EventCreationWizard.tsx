
import { useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WizardHeader } from "./WizardHeader";
import { WizardFooter } from "./WizardFooter";
import { StepIndicator } from "./StepIndicator";
import { EventFormatStep, EventTypeStep, EventDetailsStep, PlayerDetailsStep } from "./steps";
import { wizardReducer, initialWizardState } from "./hooks/useWizardState";

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
      // Add haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
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
        if (!state.formData.eventType) return false;
        if (state.formData.eventType === "multi-week") {
          return !!(state.formData.seriesTitle && state.formData.events.length > 0);
        }
        return true;
      case 3:
        if (!state.formData.eventTitle.trim()) return false;
        if (!state.formData.description.trim()) return false;
        if (!state.formData.eventDate) return false;
        if (!state.formData.eventTime) return false;
        if (!state.formData.location.trim()) return false;
        
        // Validate date/time is in the future
        const eventDateTime = new Date(`${state.formData.eventDate}T${state.formData.eventTime}`);
        const currentTime = new Date("2025-05-26T20:41:00-07:00");
        if (eventDateTime <= currentTime) return false;
        
        return true;
      case 4:
        if (state.formData.maxPlayers < 8 || state.formData.maxPlayers > 64) return false;
        if (state.formData.maxPlayers % 4 !== 0) return false;
        if ((state.formData.pricingModel === "one-time" || state.formData.pricingModel === "per-event")) {
          if (!state.formData.feeAmount || state.formData.feeAmount < 0 || state.formData.feeAmount > 100) return false;
        }
        return true;
      case 5:
        return !!(state.formData.rankingMethod && state.formData.skillCategory);
      case 6:
        return true;
      default:
        return false;
    }
  };

  const getValidationErrors = () => {
    const errors: any = {};
    
    if (state.currentStep === 3) {
      if (!state.formData.eventTitle.trim()) {
        errors.eventTitle = "Event title is required";
      }
      if (!state.formData.description.trim()) {
        errors.description = "Description is required";
      }
      if (!state.formData.eventDate) {
        errors.eventDate = "Date is required";
      } else if (!state.formData.eventTime) {
        errors.eventTime = "Time is required";
      } else {
        const eventDateTime = new Date(`${state.formData.eventDate}T${state.formData.eventTime}`);
        const currentTime = new Date("2025-05-26T20:41:00-07:00");
        if (eventDateTime <= currentTime) {
          errors.eventDate = "Date/Time must be in the future";
        }
      }
      if (!state.formData.location.trim()) {
        errors.location = "Location is required";
      }
    }

    if (state.currentStep === 4) {
      if (state.formData.maxPlayers < 8 || state.formData.maxPlayers > 64 || state.formData.maxPlayers % 4 !== 0) {
        errors.maxPlayers = "Max players must be 8-64 and a multiple of 4";
      }
      if ((state.formData.pricingModel === "one-time" || state.formData.pricingModel === "per-event")) {
        if (!state.formData.feeAmount || state.formData.feeAmount < 0 || state.formData.feeAmount > 100) {
          errors.feeAmount = "Fee must be $0-$100";
        }
      }
    }
    
    return errors;
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
      
      case 2:
        return (
          <EventTypeStep
            eventType={state.formData.eventType}
            seriesTitle={state.formData.seriesTitle}
            events={state.formData.events}
            onEventTypeChange={(eventType) => handleFormDataUpdate({ eventType })}
            onSeriesTitleChange={(seriesTitle) => handleFormDataUpdate({ seriesTitle })}
            onEventsChange={(events) => handleFormDataUpdate({ events })}
            error={state.validationErrors.eventType}
          />
        );
      
      case 3:
        return (
          <EventDetailsStep
            eventTitle={state.formData.eventTitle}
            description={state.formData.description}
            eventDate={state.formData.eventDate}
            eventTime={state.formData.eventTime}
            location={state.formData.location}
            onEventTitleChange={(eventTitle) => handleFormDataUpdate({ eventTitle })}
            onDescriptionChange={(description) => handleFormDataUpdate({ description })}
            onEventDateChange={(eventDate) => handleFormDataUpdate({ eventDate })}
            onEventTimeChange={(eventTime) => handleFormDataUpdate({ eventTime })}
            onLocationChange={(location) => handleFormDataUpdate({ location })}
            errors={getValidationErrors()}
          />
        );
      
      case 4:
        return (
          <PlayerDetailsStep
            maxPlayers={state.formData.maxPlayers}
            allowReserves={state.formData.allowReserves}
            pricingModel={state.formData.pricingModel}
            feeAmount={state.formData.feeAmount}
            onMaxPlayersChange={(maxPlayers) => handleFormDataUpdate({ maxPlayers })}
            onAllowReservesChange={(allowReserves) => handleFormDataUpdate({ allowReserves })}
            onPricingModelChange={(pricingModel) => handleFormDataUpdate({ pricingModel })}
            onFeeAmountChange={(feeAmount) => handleFormDataUpdate({ feeAmount })}
            errors={getValidationErrors()}
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
