
import React from "react";
import { EventFormatStep, EventTypeStep, EventDetailsStep, PlayerDetailsStep, RankingDetailsStep, ReviewAndConfirmStep } from "../steps";
import type { EventFormData } from "../types";

interface WizardStepRendererProps {
  currentStep: number;
  formData: EventFormData;
  validationErrors: Record<string, string>;
  onFormDataUpdate: (data: any) => void;
  onEventSubmission: () => void;
  getValidationErrors: () => Record<string, string>;
  isLoading: boolean;
}

export const WizardStepRenderer = ({
  currentStep,
  formData,
  validationErrors,
  onFormDataUpdate,
  onEventSubmission,
  getValidationErrors,
  isLoading
}: WizardStepRendererProps) => {
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

  switch (currentStep) {
    case 1:
      return (
        <EventFormatStep
          value={formData.eventFormat}
          onChange={(eventFormat) => onFormDataUpdate({ eventFormat })}
          error={validationErrors.eventFormat}
        />
      );
    
    case 2:
      return (
        <EventTypeStep
          eventType={formData.eventType}
          seriesTitle={formData.seriesTitle}
          events={formData.events}
          onEventTypeChange={(eventType) => onFormDataUpdate({ eventType })}
          onSeriesTitleChange={(seriesTitle) => onFormDataUpdate({ seriesTitle })}
          onEventsChange={(events) => onFormDataUpdate({ events })}
          error={validationErrors.eventType}
        />
      );
    
    case 3:
      return (
        <EventDetailsStep
          eventTitle={formData.eventTitle}
          description={formData.description}
          eventDate={formData.eventDate}
          eventTime={formData.eventTime}
          location={formData.location}
          onEventTitleChange={(eventTitle) => onFormDataUpdate({ eventTitle })}
          onDescriptionChange={(description) => onFormDataUpdate({ description })}
          onEventDateChange={(eventDate) => onFormDataUpdate({ eventDate })}
          onEventTimeChange={(eventTime) => onFormDataUpdate({ eventTime })}
          onLocationChange={(location) => onFormDataUpdate({ location })}
          errors={getValidationErrors()}
        />
      );
    
    case 4:
      return (
        <PlayerDetailsStep
          maxPlayers={formData.maxPlayers}
          allowReserves={formData.allowReserves}
          pricingModel={formData.pricingModel}
          feeAmount={formData.feeAmount}
          onMaxPlayersChange={(maxPlayers) => onFormDataUpdate({ maxPlayers })}
          onAllowReservesChange={(allowReserves) => onFormDataUpdate({ allowReserves })}
          onPricingModelChange={(pricingModel) => onFormDataUpdate({ pricingModel })}
          onFeeAmountChange={(feeAmount) => onFormDataUpdate({ feeAmount })}
          errors={getValidationErrors()}
        />
      );

    case 5:
      return (
        <RankingDetailsStep
          rankingMethod={formData.rankingMethod}
          skillCategory={formData.skillCategory}
          onRankingMethodChange={(rankingMethod) => onFormDataUpdate({ rankingMethod })}
          onSkillCategoryChange={(skillCategory) => onFormDataUpdate({ skillCategory })}
          errors={getValidationErrors()}
        />
      );

    case 6:
      return (
        <ReviewAndConfirmStep
          formData={formData}
          onSubmit={onEventSubmission}
          isLoading={isLoading}
        />
      );
    
    default:
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              Step {currentStep}: {getStepTitle(currentStep)}
            </h2>
            <p className="text-gray-600">
              Step component will be implemented in next phase
            </p>
          </div>
        </div>
      );
  }
};
