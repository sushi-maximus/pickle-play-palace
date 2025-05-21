
import { Link } from "react-router-dom";
import { Users, Trophy, Activity, Repeat, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FeatureCard } from "@/components/FeatureCard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section - Modernized */}
        <section className="py-20 md:py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pickle-50/50 to-transparent dark:from-pickle-900/30 dark:to-transparent"></div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
                  <span className="text-primary">Pickle Ninja</span>
                  <span className="block mt-2">Connect. Compete. Play.</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0">
                  The ultimate pickleball community platform that connects players, 
                  organizes games, and helps you elevate your skills.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/signup">
                    <Button size="lg" className="gap-2 text-base px-8">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="text-base px-8">
                      Log In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <div className="w-full aspect-square max-w-md mx-auto bg-gradient-to-br from-pickle-300/40 to-pickle-500/40 dark:from-pickle-800/40 dark:to-pickle-600/40 rounded-full flex items-center justify-center">
                    <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-pickle-400 to-pickle-600 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-5xl">PN</span>
                    </div>
                  </div>
                  <div className="absolute -top-8 right-8 w-20 h-20 rounded-full bg-secondary/30 animate-bounce-slow"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-primary/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section - Modernized */}
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
        
        {/* Business Model Section - Modernized */}
        <section className="py-24 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="text-sm uppercase tracking-wider text-primary font-semibold">Our approach</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Free to Use, Fair for All</h2>
              <div className="w-24 h-1 bg-primary mx-auto mt-6 mb-8"></div>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Pickle Ninja is completely free for individual players. We only charge a small commission on paid events and tournaments.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              <div className="bg-card border-0 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-5">For Players</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold text-xl">✓</span>
                    <span>Create your player profile for free</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold text-xl">✓</span>
                    <span>Join groups and chat with other players</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold text-xl">✓</span>
                    <span>Track your matches and progress</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold text-xl">✓</span>
                    <span>Join free events and games</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card border-0 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-5">For Organizers</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold text-xl">✓</span>
                    <span>Organize free events at no cost</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold text-xl">✓</span>
                    <span>Create paid tournaments with easy payment processing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary text-primary-foreground px-2 py-0.5 text-xs rounded font-medium">FAIR</span>
                    <span>Only 10-20% commission on paid events</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-bold text-xl">✓</span>
                    <span>Powerful tools for managing registrations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section - Modernized */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-gradient-to-r from-pickle-600 to-secondary rounded-3xl p-10 md:p-16 text-white text-center overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybildIi8+PC9zdmc+')] opacity-50 mix-blend-overlay"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Ready to Join the Pickle Community?</h2>
                <p className="text-white/90 max-w-2xl mx-auto mb-10 text-lg">
                  Create your free account today and start connecting with other pickleball enthusiasts in your area.
                </p>
                <Link to="/signup">
                  <Button size="lg" variant="secondary" className="gap-2 text-base px-10 py-6">
                    Sign Up Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
