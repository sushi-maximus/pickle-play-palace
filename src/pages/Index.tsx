
import { Link } from "react-router-dom";
import { Users, Trophy, Activity, Repeat, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FeatureCard } from "@/components/FeatureCard";
import { SkillLevelGuide } from "@/components/SkillLevelGuide";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span className="block">Pickle Ninja:</span>
                  <span className="text-primary">Connect, Compete, Play Free!</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                  The ultimate pickleball community platform for organizing games, 
                  tracking progress, and connecting with players in your area.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/signup">
                    <Button size="lg" className="gap-2">
                      Sign Up Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline">
                      Log In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="w-full h-80 md:h-96 bg-primary/10 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-pickle-500 flex items-center justify-center animate-bounce-slow">
                      <span className="text-white font-bold text-2xl">PN</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-5 -right-5 w-40 h-40 bg-secondary/20 rounded-full"></div>
                  <div className="absolute top-10 -left-5 w-24 h-24 bg-pickle-300/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Pickle Players</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to organize games, track progress, and grow your pickleball community.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard 
                title="Groups" 
                description="Chat and organize events with your pickleball community."
                icon={Users}
              />
              <FeatureCard 
                title="Ladder Leagues" 
                description="Earn points, climb rankings, and prove your skills."
                icon={Activity}
              />
              <FeatureCard 
                title="Tournaments" 
                description="Compete in elimination events and win prizes."
                icon={Trophy}
              />
              <FeatureCard 
                title="King's Court" 
                description="Battle for the top court and defend your position."
                icon={Crown}
              />
              <FeatureCard 
                title="Round Robin" 
                description="Enjoy flexible matches with diverse opponents."
                icon={Repeat}
              />
              <FeatureCard 
                title="Score Tracking" 
                description="Track stats, analyze performance, and update your DUPR rating."
                icon={Activity}
              />
            </div>
          </div>
        </section>
        
        {/* Skill Level Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-card border border-border rounded-xl p-8 md:p-12 shadow-sm">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Not Sure About Your Skill Level?</h2>
                  <p className="text-muted-foreground mb-6">
                    Understanding your skill level helps you find appropriate matches and partners. 
                    Check our guide to determine where you fit on the scale.
                  </p>
                  <SkillLevelGuide />
                </div>
                <div className="flex-1 relative">
                  <div className="w-full h-48 bg-gradient-to-r from-pickle-100 to-pickle-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-pickle-700">2.5 → 5.5</div>
                      <div className="text-pickle-800 mt-2">From Beginner to Pro</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Business Model Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Free to Use, Fair for All</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Pickle Ninja is free to use for individual players. We only charge a small 10-20% commission on paid events and tournaments.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">For Players</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Create your player profile for free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Join groups and chat with other players</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Track your matches and progress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Join free events and games</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">For Organizers</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Organize free events at no cost</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Create paid tournaments with easy payment processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-foreground bg-primary text-xs px-1 rounded">FAIR</span>
                    <span>Only 10-20% commission on paid events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Powerful tools for managing registrations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-gradient-to-r from-pickle-600 to-pickle-500 rounded-2xl p-8 md:p-12 text-white text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join the Pickle Community?</h2>
              <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
                Create your free account today and start connecting with other pickleball enthusiasts in your area.
              </p>
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="gap-2">
                  Sign Up Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
