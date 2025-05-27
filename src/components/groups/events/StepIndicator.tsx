
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { EventFormData } from "./types";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  formData: EventFormData;
}

const getStepValue = (step: number, formData: EventFormData): string => {
  switch (step) {
    case 1:
      return formData.eventFormat ? `${formData.eventFormat}` : "";
    case 2:
      if (formData.eventType === "multi-week") {
        return formData.seriesTitle ? `Multi-week: ${formData.seriesTitle}` : "Multi-week";
      }
      return formData.eventType === "one-time" ? "One-time Event" : "";
    case 3:
      const details = [];
      if (formData.eventTitle) details.push(formData.eventTitle);
      if (formData.eventDate) details.push(formData.eventDate);
      return details.join(" • ");
    case 4:
      const playerDetails = [];
      if (formData.maxPlayers > 0) playerDetails.push(`${formData.maxPlayers} players`);
      if (formData.allowReserves) playerDetails.push("Reserves allowed");
      return playerDetails.join(" • ");
    case 5:
      const rankingDetails = [];
      if (formData.rankingMethod) rankingDetails.push(formData.rankingMethod);
      if (formData.skillCategory) rankingDetails.push(formData.skillCategory);
      return rankingDetails.join(" • ");
    default:
      return "";
  }
};

export const StepIndicator = ({ currentStep, totalSteps, formData }: StepIndicatorProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <TooltipProvider>
      <div className="fixed top-[58px] left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          {/* Circles container */}
          <div className="flex items-center justify-between relative mx-3 md:mx-4">
            {/* Connecting line - positioned to connect between circle centers */}
            <div 
              className="absolute top-1/2 h-0.5 bg-gray-200 -translate-y-1/2 z-0"
              style={{ 
                left: '12px', // Half of mobile circle width (24px) to reach center
                right: '12px' // Half of mobile circle width (24px) to reach center
              }}
            />
            <div 
              className="absolute top-1/2 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-300"
              style={{ 
                left: '12px', // Half of mobile circle width (24px) to reach center
                width: `calc(${((currentStep - 1) / (totalSteps - 1)) * 100}% - 24px)` // Subtract full circle width
              }}
            />
            
            {/* Step circles */}
            {steps.map((step) => {
              const isCompleted = step < currentStep;
              const isCurrent = step === currentStep;
              const isUpcoming = step > currentStep;
              const stepValue = getStepValue(step, formData);
              const showTooltip = isCompleted && stepValue;
              
              const circleContent = (
                <div
                  className="relative z-10 flex flex-col items-center"
                >
                  <div
                    className={`
                      w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
                      ${isCompleted 
                        ? 'bg-primary border-primary text-white' 
                        : isCurrent 
                        ? 'bg-white border-primary ring-4 ring-primary/20' 
                        : 'bg-white border-gray-300'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <svg 
                        className="w-3 h-3 md:w-4 md:h-4" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    ) : (
                      <span 
                        className={`
                          text-xs md:text-sm font-medium
                          ${isCurrent ? 'text-primary' : 'text-gray-400'}
                        `}
                      >
                        {step}
                      </span>
                    )}
                  </div>
                </div>
              );

              return showTooltip ? (
                <Tooltip key={step}>
                  <TooltipTrigger asChild>
                    {circleContent}
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[200px]">
                    <p className="text-sm">{stepValue}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div key={step}>
                  {circleContent}
                </div>
              );
            })}
          </div>
          
          {/* Step counter text */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Step {currentStep}</span>
            <span>{currentStep} of {totalSteps}</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
