
import { FeatureCard } from "@/components/FeatureCard";
import { Users, Trophy, Activity, Repeat, Crown } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-sm uppercase tracking-wider text-primary font-semibold">What we offer</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Powerful Features for Pickle Players</h2>
          <div className="w-24 h-1 bg-primary mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            title="Communities" 
            description="Connect with players, join groups, and organize events with your local pickleball community."
            icon={Users}
            className="transform transition-all hover:translate-y-[-8px]"
          />
          <FeatureCard 
            title="Ladder Leagues" 
            description="Earn points, climb rankings, and prove your skills against players at your level."
            icon={Activity}
            className="transform transition-all hover:translate-y-[-8px]"
          />
          <FeatureCard 
            title="Tournaments" 
            description="Compete in elimination events and win prizes. Easily manage brackets and schedules."
            icon={Trophy}
            className="transform transition-all hover:translate-y-[-8px]"
          />
          <FeatureCard 
            title="King's Court" 
            description="Battle for the top court and defend your position in this competitive format."
            icon={Crown}
            className="transform transition-all hover:translate-y-[-8px]"
          />
          <FeatureCard 
            title="Round Robin" 
            description="Enjoy flexible matches with diverse opponents for balanced play and maximum court time."
            icon={Repeat}
            className="transform transition-all hover:translate-y-[-8px]"
          />
          <FeatureCard 
            title="Score Tracking" 
            description="Track stats, analyze performance, and update your DUPR rating after every match."
            icon={Activity}
            className="transform transition-all hover:translate-y-[-8px]"
          />
        </div>
      </div>
    </section>
  );
}
