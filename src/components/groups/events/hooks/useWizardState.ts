
import { useReducer } from "react";
import type { WizardState, WizardAction } from "../types";

export const initialWizardState: WizardState = {
  currentStep: 1,
  isLoading: false,
  formData: {
    groupId: "",
    eventFormat: "",
    eventType: "",
    seriesTitle: "",
    events: [],
    eventTitle: "",
    description: "",
    eventDate: "",
    eventTime: "",
    location: "",
    maxPlayers: 16,
    allowReserves: false,
    pricingModel: "free",
    feeAmount: null,
    rankingMethod: "",
    skillCategory: "none"
  },
  validationErrors: {}
};

export const wizardReducer = (state: WizardState, action: WizardAction): WizardState => {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 6)
      };
    
    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1)
      };
    
    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: Math.max(1, Math.min(action.payload, 6))
      };
    
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload
        }
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_VALIDATION_ERRORS':
      return {
        ...state,
        validationErrors: action.payload
      };
    
    case 'RESET_WIZARD':
      return {
        ...initialWizardState,
        formData: {
          ...initialWizardState.formData,
          groupId: state.formData.groupId
        }
      };
    
    default:
      return state;
  }
};

export const useWizardState = (groupId: string) => {
  const [state, dispatch] = useReducer(wizardReducer, {
    ...initialWizardState,
    formData: {
      ...initialWizardState.formData,
      groupId
    }
  });

  return { state, dispatch };
};
