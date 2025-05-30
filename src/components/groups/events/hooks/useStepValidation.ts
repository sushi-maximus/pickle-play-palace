
import type { EventFormData } from "../types";

export const useStepValidation = () => {
  const validateCurrentStep = (currentStep: number, formData: EventFormData): boolean => {
    switch (currentStep) {
      case 1:
        return !!formData.eventFormat;
      case 2:
        if (!formData.eventType) return false;
        if (formData.eventType === "multi-week") {
          return !!(formData.seriesTitle && formData.events.length > 0);
        }
        return true;
      case 3:
        if (!formData.eventTitle.trim()) return false;
        if (!formData.description.trim()) return false;
        if (!formData.eventDate) return false;
        if (!formData.eventTime) return false;
        if (!formData.location.trim()) return false;
        
        // Validate date/time is in the future - use current time instead of hardcoded
        const eventDateTime = new Date(`${formData.eventDate}T${formData.eventTime}`);
        const currentTime = new Date();
        if (eventDateTime <= currentTime) return false;
        
        return true;
      case 4:
        if (formData.maxPlayers < 8 || formData.maxPlayers > 64) return false;
        if (formData.maxPlayers % 4 !== 0) return false;
        if (formData.pricingModel === "one-time") {
          if (!formData.feeAmount || formData.feeAmount < 0 || formData.feeAmount > 100) return false;
        }
        return true;
      case 5:
        return !!(formData.rankingMethod && formData.skillCategory);
      case 6:
        return true;
      default:
        return false;
    }
  };

  const getValidationErrors = (currentStep: number, formData: EventFormData) => {
    const errors: any = {};
    
    if (currentStep === 3) {
      if (!formData.eventTitle.trim()) {
        errors.eventTitle = "Event title is required";
      }
      if (!formData.description.trim()) {
        errors.description = "Description is required";
      }
      if (!formData.eventDate) {
        errors.eventDate = "Date is required";
      } else if (!formData.eventTime) {
        errors.eventTime = "Time is required";
      } else {
        const eventDateTime = new Date(`${formData.eventDate}T${formData.eventTime}`);
        const currentTime = new Date();
        if (eventDateTime <= currentTime) {
          errors.eventDate = "Date/Time must be in the future";
        }
      }
      if (!formData.location.trim()) {
        errors.location = "Location is required";
      }
    }

    if (currentStep === 4) {
      if (formData.maxPlayers < 8 || formData.maxPlayers > 64 || formData.maxPlayers % 4 !== 0) {
        errors.maxPlayers = "Max players must be 8-64 and a multiple of 4";
      }
      if (formData.pricingModel === "one-time") {
        if (!formData.feeAmount || formData.feeAmount < 0 || formData.feeAmount > 100) {
          errors.feeAmount = "Fee must be $0-$100";
        }
      }
    }

    if (currentStep === 5) {
      if (!formData.rankingMethod) {
        errors.rankingMethod = "Ranking method is required";
      }
      if (!formData.skillCategory) {
        errors.skillCategory = "Skill category is required";
      }
    }
    
    return errors;
  };

  return { validateCurrentStep, getValidationErrors };
};
