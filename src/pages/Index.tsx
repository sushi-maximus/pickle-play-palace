
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { BusinessModelSection } from "@/components/landing/BusinessModelSection";
import { CtaSection } from "@/components/landing/CtaSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <BusinessModelSection />
        <CtaSection />
      </main>
    </div>
  );
};

export default Index;
