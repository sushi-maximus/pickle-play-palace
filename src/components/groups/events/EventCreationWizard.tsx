import { useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WizardHeader } from "./WizardHeader";
import { WizardFooter } from "./WizardFooter";
import { StepIndicator } from "./StepIndicator";
import { EventFormatStep, EventTypeStep, EventDetailsStep, PlayerDetailsStep, RankingDetailsStep, ReviewAndConfirmStep } from "./steps";
import { wizardReducer, initialWizardState } from "./hooks/useWizardState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const handleNext = async () => {
    if (state.currentStep < 6) {
      // Add haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      dispatch({ type: 'NEXT_STEP' });
    } else if (state.currentStep === 6) {
      // Handle event creation on final step
      await handleEventSubmission();
    }
  };

  const handleEventSubmission = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error("You must be logged in to create an event");
        return;
      }

      if (state.formData.eventType === "multi-week") {
        // Create event series first
        const { data: seriesData, error: seriesError } = await supabase
          .from('event_series')
          .insert({
            group_id: groupId,
            organizer_id: user.id,
            series_title: state.formData.seriesTitle,
            event_type: state.formData.eventType,
            event_format: state.formData.eventFormat
          })
          .select()
          .single();

        if (seriesError) {
          toast.error("Failed to create event series");
          console.error("Series creation error:", seriesError);
          return;
        }

        // Create individual events
        const eventPromises = state.formData.events.map(event => 
          supabase.from('events').insert({
            series_id: seriesData.id,
            group_id: groupId,
            event_title: event.eventTitle,
            description: event.description,
            event_date: event.eventDate,
            event_time: event.eventTime,
            location: event.location,
            max_players: event.maxPlayers,
            allow_reserves: event.allowReserves,
            pricing_model: event.pricingModel,
            fee_amount: event.feeAmount,
            ranking_method: event.rankingMethod,
            skill_category: event.skillCategory,
            event_format: state.formData.eventFormat
          })
        );

        await Promise.all(eventPromises);
        toast.success("Multi-week event series created successfully!");
      } else {
        // Create single event series entry
        const { data: seriesData, error: seriesError } = await supabase
          .from('event_series')
          .insert({
            group_id: groupId,
            organizer_id: user.id,
            event_type: state.formData.eventType,
            event_format: state.formData.eventFormat
          })
          .select()
          .single();

        if (seriesError) {
          toast.error("Failed to create event series");
          console.error("Series creation error:", seriesError);
          return;
        }

        // Create single event
        const { error: eventError } = await supabase
          .from('events')
          .insert({
            series_id: seriesData.id,
            group_id: groupId,
            event_title: state.formData.eventTitle,
            description: state.formData.description,
            event_date: state.formData.eventDate,
            event_time: state.formData.eventTime,
            location: state.formData.location,
            max_players: state.formData.maxPlayers,
            allow_reserves: state.formData.allowReserves,
            pricing_model: state.formData.pricingModel,
            fee_amount: state.formData.feeAmount,
            ranking_method: state.formData.rankingMethod,
            skill_category: state.formData.skillCategory,
            event_format: state.formData.eventFormat
          });

        if (eventError) {
          toast.error("Failed to create event");
          console.error("Event creation error:", eventError);
          return;
        }

        toast.success("Event created successfully!");
      }

      // Navigate back to group page
      navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
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
        if (state.formData.pricingModel === "one-time") {
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
      if (state.formData.pricingModel === "one-time") {
        if (!state.formData.feeAmount || state.formData.feeAmount < 0 || state.formData.feeAmount > 100) {
          errors.feeAmount = "Fee must be $0-$100";
        }
      }
    }

    if (state.currentStep === 5) {
      if (!state.formData.rankingMethod) {
        errors.rankingMethod = "Ranking method is required";
      }
      if (!state.formData.skillCategory) {
        errors.skillCategory = "Skill category is required";
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

      case 5:
        return (
          <RankingDetailsStep
            rankingMethod={state.formData.rankingMethod}
            skillCategory={state.formData.skillCategory}
            onRankingMethodChange={(rankingMethod) => handleFormDataUpdate({ rankingMethod })}
            onSkillCategoryChange={(skillCategory) => handleFormDataUpdate({ skillCategory })}
            errors={getValidationErrors()}
          />
        );

      case 6:
        return (
          <ReviewAndConfirmStep
            formData={state.formData}
            onSubmit={handleEventSubmission}
            isLoading={state.isLoading}
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
