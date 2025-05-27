
import { EventFormatStep } from "../steps/EventFormatStep";
import { EventTypeStep } from "../steps/EventTypeStep";
import { EventDetailsStep } from "../steps/EventDetailsStep";
import { PlayerDetailsStep } from "../steps/PlayerDetailsStep";
import { RankingDetailsStep } from "../steps/RankingDetailsStep";
import { ReviewAndConfirmStep } from "../steps/ReviewAndConfirmStep";
import type { EventFormData } from "../types";

interface WizardStepRendererProps {
  currentStep: number;
  formData: EventFormData;
  validationErrors: Record<string, string>;
  onFormDataUpdate: (data: Partial<EventFormData>) => void;
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
  const handleFormUpdate = (updates: Partial<EventFormData>) => {
    onFormDataUpdate(updates);
  };

  switch (currentStep) {
    case 1:
      return (
        <EventFormatStep
          value={formData.eventFormat}
          onChange={(value) => handleFormUpdate({ eventFormat: value })}
          error={validationErrors.eventFormat}
        />
      );

    case 2:
      return (
        <EventTypeStep
          eventType={formData.eventType}
          seriesTitle={formData.seriesTitle}
          events={formData.events}
          eventFormat={formData.eventFormat}
          onEventTypeChange={(value) => handleFormUpdate({ eventType: value })}
          onSeriesTitleChange={(value) => handleFormUpdate({ seriesTitle: value })}
          onEventsChange={(events) => handleFormUpdate({ events })}
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
          onEventTitleChange={(title) => handleFormUpdate({ eventTitle: title })}
          onDescriptionChange={(description) => handleFormUpdate({ description })}
          onEventDateChange={(date) => handleFormUpdate({ eventDate: date })}
          onEventTimeChange={(time) => handleFormUpdate({ eventTime: time })}
          onLocationChange={(location) => handleFormUpdate({ location })}
          errors={getValidationErrors()}
          eventFormat={formData.eventFormat}
          eventType={formData.eventType}
        />
      );

    case 4:
      return (
        <PlayerDetailsStep
          maxPlayers={formData.maxPlayers}
          allowReserves={formData.allowReserves}
          pricingModel={formData.pricingModel}
          feeAmount={formData.feeAmount}
          onMaxPlayersChange={(maxPlayers) => handleFormUpdate({ maxPlayers })}
          onAllowReservesChange={(allowReserves) => handleFormUpdate({ allowReserves })}
          onPricingModelChange={(pricingModel) => handleFormUpdate({ pricingModel })}
          onFeeAmountChange={(feeAmount) => handleFormUpdate({ feeAmount })}
          errors={getValidationErrors()}
          eventFormat={formData.eventFormat}
          eventType={formData.eventType}
        />
      );

    case 5:
      return (
        <RankingDetailsStep
          rankingMethod={formData.rankingMethod}
          skillCategory={formData.skillCategory}
          onRankingMethodChange={(rankingMethod) => handleFormUpdate({ rankingMethod })}
          onSkillCategoryChange={(skillCategory) => handleFormUpdate({ skillCategory })}
          errors={getValidationErrors()}
          eventFormat={formData.eventFormat}
          eventType={formData.eventType}
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
      return <div>Invalid step</div>;
  }
};
