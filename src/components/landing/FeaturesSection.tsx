
import { FeatureCard } from "@/components/FeatureCard";
import { Users, Trophy, Activity, Repeat, Crown, AreaChart } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-muted/30 to-transparent"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16 animate-[fade-in_0.6s_ease-out]">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Elevate Your Pickleball Experience</h2>
          <div className="w-24 h-1 bg-primary mx-auto mt-6"></div>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
            Everything you need to play, compete, and connect
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              title: "Communities", 
              description: "Connect with local players and organize events together.",
              icon: Users,
              delay: 0
            },
            { 
              title: "Ladder Leagues", 
              description: "Compete, earn points, and climb the rankings.",
              icon: Activity,
              delay: 100
            },
            { 
              title: "Tournaments", 
              description: "Join elimination events with automated brackets.",
              icon: Trophy,
              delay: 200
            },
            { 
              title: "King's Court", 
              description: "Battle for the top court and defend your position.",
              icon: Crown,
              delay: 300
            },
            { 
              title: "Round Robin", 
              description: "Enjoy diverse matches with maximum court time.",
              icon: Repeat,
              delay: 400
            },
            { 
              title: "Score Tracking", 
              description: "Track stats and update your DUPR rating.",
              icon: AreaChart,
              delay: 500
            }
          ].map((feature, index) => (
            <div 
              key={feature.title}
              className="animate-[fade-in_0.5s_ease-out]"
              style={{ animationDelay: `${feature.delay}ms` }}
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                className="transform transition-all hover:translate-y-[-8px] h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
