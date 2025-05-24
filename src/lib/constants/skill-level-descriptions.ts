
export interface SkillLevelDescription {
  description: string[];
}

export interface SkillLevelAdvice {
  advice: string[];
}

// Current level descriptions with bullet points
export const currentLevelDescriptions: Record<string, SkillLevelDescription> = {
  "2.5": {
    description: [
      "New to pickleball",
      "Learning basic rules, shots, and positioning"
    ]
  },
  "3.0": {
    description: [
      "Developing consistency in basic shots",
      "Can sustain rallies",
      "Beginning to understand strategy"
    ]
  },
  "3.5": {
    description: [
      "More consistent with all basic shots",
      "Developing advanced shots and strategies",
      "Can play at the non-volley zone"
    ]
  },
  "4.0": {
    description: [
      "Consistent with all shots including directional control",
      "Uses strategy effectively",
      "Can force errors"
    ]
  },
  "4.5": {
    description: [
      "Very consistent with all shots",
      "Anticipates opponent's shots",
      "Has developed power in shots"
    ]
  },
  "5.0": {
    description: [
      "Highly skilled player with exceptional shot control",
      "Strategic play and minimal unforced errors"
    ]
  },
  "5.5": {
    description: [
      "Tournament-level player with advanced precision",
      "Power mastery",
      "Strategic mastery"
    ]
  }
};

// Next level advice with bullet points
export const nextLevelAdvice: Record<string, SkillLevelAdvice> = {
  "3.0": {
    advice: [
      "Work on developing consistency in basic shots",
      "Practice sustaining rallies",
      "Begin to understand strategy"
    ]
  },
  "3.5": {
    advice: [
      "Focus on consistency with all basic shots",
      "Develop advanced shots and strategies",
      "Learn to play at the non-volley zone"
    ]
  },
  "4.0": {
    advice: [
      "Achieve consistency with all shots including directional control",
      "Use strategy effectively",
      "Learn to force errors"
    ]
  },
  "4.5": {
    advice: [
      "Develop very consistent shots",
      "Learn to anticipate opponent's shots",
      "Develop power in your shots"
    ]
  },
  "5.0": {
    advice: [
      "Master exceptional shot control",
      "Focus on strategic play",
      "Minimize unforced errors"
    ]
  },
  "5.5": {
    advice: [
      "Achieve tournament-level precision",
      "Master power techniques",
      "Perfect strategic mastery"
    ]
  }
};

// Helper function to get current level description
export const getCurrentLevelDescription = (skillLevel: string): string[] => {
  return currentLevelDescriptions[skillLevel]?.description || [];
};

// Helper function to get next level advice
export const getNextLevelAdvice = (nextSkillLevel: string): string[] => {
  return nextLevelAdvice[nextSkillLevel]?.advice || [];
};
