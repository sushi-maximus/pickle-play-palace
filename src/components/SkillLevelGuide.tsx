
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { skillLevelColors } from "@/lib/constants/skill-levels";

interface SkillLevelGuideProps {
  triggerElement?: React.ReactNode;
}

export function SkillLevelGuide({ triggerElement }: SkillLevelGuideProps) {
  const skillLevels = [
    {
      level: "2.5",
      name: "Beginner",
      description: "New to pickleball. Learning basic rules, shots, and positioning."
    },
    {
      level: "3.0",
      name: "Intermediate",
      description: "Developing consistency in basic shots and can sustain rallies. Beginning to understand strategy."
    },
    {
      level: "3.5",
      name: "Advanced Intermediate",
      description: "More consistent with all basic shots. Developing advanced shots and strategies. Can play at the non-volley zone."
    },
    {
      level: "4.0",
      name: "Advanced",
      description: "Consistent with all shots including directional control. Uses strategy effectively and can force errors."
    },
    {
      level: "4.5",
      name: "Highly Advanced",
      description: "Very consistent with all shots. Anticipates opponent's shots and has developed power in shots."
    },
    {
      level: "5.0",
      name: "Expert/Pro",
      description: "Highly skilled player with exceptional shot control, strategic play, and minimal unforced errors."
    },
    {
      level: "5.5",
      name: "Professional/Elite",
      description: "Tournament-level player with advanced precision, power, and strategic mastery."
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerElement || (
          <Button variant="link" className="p-0 text-primary underline underline-offset-4">
            Learn Your Skill Level
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Pickleball Skill Level Guide</DialogTitle>
          <DialogDescription>
            Understanding your skill level helps you find appropriate matches and tracks your progress.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {skillLevels.map((skill) => (
            <div 
              key={skill.level} 
              className="border border-border rounded-lg p-4 flex items-start gap-3"
              style={{ borderLeftWidth: '4px', borderLeftColor: skillLevelColors[skill.level] }}
            >
              <div 
                className="h-4 w-4 rounded-full mt-1 flex-shrink-0" 
                style={{ 
                  backgroundColor: skillLevelColors[skill.level], 
                  border: skillLevelColors[skill.level] === "#FFFFFF" ? "1px solid #e2e8f0" : "none" 
                }}
              />
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  {skill.level} - {skill.name}
                </h3>
                <p className="text-muted-foreground">{skill.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t pt-4 text-sm text-muted-foreground">
          <p className="font-medium mb-2">Skill Level Color Guide</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(skillLevelColors).map(([level, color]) => {
              const skillLevel = skillLevels.find(skill => skill.level === level);
              return (
                <div key={level} className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ 
                      backgroundColor: color, 
                      border: color === "#FFFFFF" ? "1px solid #e2e8f0" : "none" 
                    }}
                  />
                  <span>{level} - {skillLevel?.name || ""}</span>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
