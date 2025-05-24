
import { TrendingUp, Users, Target } from "lucide-react";

export interface PlayerLevelStrategy {
  icon: typeof TrendingUp;
  iconColor: string;
  title: string;
  description: string;
  bulletPoints: string[];
}

export const threeLevelStrategyData: PlayerLevelStrategy[] = [
  {
    icon: TrendingUp,
    iconColor: "text-green-600",
    title: "Better players",
    description: "Challenges you to elevate your skills. You observe advanced techniques, strategies, and decision-making, pushing you to adapt and learn. It exposes weaknesses in your game and forces you to play at a higher intensity, accelerating skill development.",
    bulletPoints: [
      "Observe advanced techniques and strategies",
      "Learn decision-making patterns from experienced players",
      "Expose weaknesses in your current game",
      "Force adaptation and faster learning",
      "Play at higher intensity levels",
      "Accelerate overall skill development"
    ]
  },
  {
    icon: Users,
    iconColor: "text-blue-600",
    title: "Similar-level players",
    description: "Provides competitive practice where matches are evenly matched. This hones your consistency, mental toughness, and ability to execute under pressure. It's ideal for refining strategies and building confidence in close games.",
    bulletPoints: [
      "Get competitive, evenly matched practice",
      "Build consistency under pressure",
      "Develop mental toughness",
      "Practice executing skills under pressure",
      "Refine strategies in real game situations",
      "Build confidence in close, competitive games"
    ]
  },
  {
    icon: Target,
    iconColor: "text-orange-600",
    title: "Less skilled players",
    description: "Allows you to dominate and experiment with new shots or tactics in a low-pressure environment. It builds confidence, reinforces fundamentals, and lets you focus on precision and control. You can also practice leadership, like controlling the pace or setting up plays.",
    bulletPoints: [
      "Practice in low-pressure environment",
      "Experiment with new shots and tactics safely",
      "Build confidence through successful execution",
      "Reinforce fundamental techniques",
      "Focus on precision and control",
      "Practice leadership skills (controlling pace, setting up plays)"
    ]
  }
];

export const strategySummary = "This mix ensures well-rounded growth: you're stretched by superiors, tested by peers, and empowered by teaching moments with beginners. Each level targets different aspects of skill, strategy, and mentality critical for improvement.";
