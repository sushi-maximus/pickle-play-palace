
export interface WizardState {
  currentStep: number;
  isLoading: boolean;
  formData: EventFormData;
  validationErrors: Record<string, string>;
}

export interface EventFormData {
  groupId: string;
  eventFormat: string;
  eventType: string;
  seriesTitle: string;
  events: MultiWeekEvent[];
  eventTitle: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  maxPlayers: number;
  allowReserves: boolean;
  pricingModel: string;
  feeAmount: number | null;
  rankingMethod: string;
  skillCategory: string;
}

export interface MultiWeekEvent {
  eventTitle: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  maxPlayers: number;
  allowReserves: boolean;
  pricingModel: string;
  feeAmount: number | null;
  rankingMethod: string;
  skillCategory: string;
}

export type WizardAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<EventFormData> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_VALIDATION_ERRORS'; payload: Record<string, string> }
  | { type: 'RESET_WIZARD' };

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

export type SportFormat = 
  | 'tennis' 
  | 'pickleball' 
  | 'padel' 
  | 'racquetball' 
  | 'table_tennis' 
  | 'squash' 
  | 'basketball' 
  | 'soccer' 
  | 'golf' 
  | 'other';
