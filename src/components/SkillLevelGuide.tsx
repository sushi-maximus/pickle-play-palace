
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

interface SkillLevelGuideProps {
  triggerElement?: React.ReactNode;
}

export function SkillLevelGuide({ triggerElement }: SkillLevelGuideProps) {
  const skillLevels = [
    {
      level: "2.5 - Beginner",
      description: "New to pickleball. Learning basic rules, shots, and positioning."
    },
    {
      level: "3.0 - Intermediate",
      description: "Developing consistency in basic shots and can sustain rallies. Beginning to understand strategy."
    },
    {
      level: "3.5 - Advanced Intermediate",
      description: "More consistent with all basic shots. Developing advanced shots and strategies. Can play at the non-volley zone."
    },
    {
      level: "4.0 - Advanced",
      description: "Consistent with all shots including directional control. Uses strategy effectively and can force errors."
    },
    {
      level: "4.5 - Highly Advanced",
      description: "Very consistent with all shots. Anticipates opponent's shots and has developed power in shots."
    },
    {
      level: "5.0 - Expert/Pro",
      description: "Highly skilled player with exceptional shot control, strategic play, and minimal unforced errors."
    },
    {
      level: "5.5 - Professional/Elite",
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
            <div key={skill.level} className="border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-1">{skill.level}</h3>
              <p className="text-muted-foreground">{skill.description}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
