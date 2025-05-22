
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="py-20 md:py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pickle-50/50 to-transparent dark:from-pickle-900/30 dark:to-transparent"></div>
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-primary/5 animate-pulse"></div>
        <div className="absolute bottom-20 left-[5%] w-96 h-96 rounded-full bg-secondary/5 animate-[pulse_8s_ease-in-out_infinite]"></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left animate-[fade-in_0.8s_ease-out]">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 transform transition-all hover:scale-105">
              The Ultimate Pickleball Platform
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
              <span className="text-primary">Pickle Ninja</span>
              <span className="block mt-2">Connect. Compete. Play.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0">
              Connect with players, organize games, and improve your pickleball skills - all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/signup">
                <Button size="lg" className="gap-2 text-base px-8 group shadow-lg hover:shadow-primary/20 transition-all">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-base px-8 transition-colors hover:bg-primary/5">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 animate-[fade-in_1s_ease-out_0.3s_both]">
            <div className="relative">
              <div className="w-full aspect-square max-w-md mx-auto bg-gradient-to-br from-pickle-300/40 to-pickle-500/40 dark:from-pickle-800/40 dark:to-pickle-600/40 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-pickle-400 to-pickle-600 flex items-center justify-center shadow-lg shadow-pickle-500/20 transform hover:scale-105 transition-transform duration-300">
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
  );
}
