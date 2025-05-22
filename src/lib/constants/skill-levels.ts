export const skillLevelOptions = [
  { value: "2.5", label: "2.5 - Beginner" },
  { value: "3.0", label: "3.0 - Intermediate" },
  { value: "3.5", label: "3.5 - Advanced Intermediate" },
  { value: "4.0", label: "4.0 - Advanced" },
  { value: "4.5", label: "4.5 - Highly Advanced" },
  { value: "5.0", label: "5.0 - Expert/Pro" },
  { value: "5.5", label: "5.5 - Professional/Elite" },
];

// Skill level color mapping for profile borders
export const skillLevelColors: Record<string, string> = {
  "2.5": "#FFFFFF", // White - Beginner
  "3.0": "#FFFF00", // Yellow - Intermediate
  "3.5": "#FFA500", // Orange - Advanced Intermediate
  "4.0": "#008000", // Green - Advanced
  "4.5": "#8B4513", // Brown - Highly Advanced
  "5.0": "#000000", // Black - Expert/Pro
  "5.5": "#FF0000", // Red - Professional/Elite
};

// Function to map DUPR rating to skill level color
export const duprToSkillLevel = (duprRating: number | null): string => {
  if (!duprRating) return "2.5";
  
  if (duprRating < 3.0) return "2.5";
  else if (duprRating < 3.5) return "3.0";
  else if (duprRating < 4.0) return "3.5";
  else if (duprRating < 4.5) return "4.0";
  else if (duprRating < 5.0) return "4.5";
  else if (duprRating < 5.5) return "5.0";
  else return "5.5";
};

// Function to get the appropriate color based on DUPR or skill level
export const getSkillLevelColor = (duprRating: number | null | undefined, skillLevel: string | undefined): string => {
  if (duprRating) {
    // If DUPR rating exists, use that to determine the color
    const mappedSkillLevel = duprToSkillLevel(duprRating);
    return skillLevelColors[mappedSkillLevel];
  }
  
  // Otherwise use the skill level or default to 2.5
  return skillLevelColors[skillLevel || "2.5"];
};
