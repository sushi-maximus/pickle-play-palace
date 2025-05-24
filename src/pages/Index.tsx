
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { BusinessModelSection } from "@/components/landing/BusinessModelSection";
import { CtaSection } from "@/components/landing/CtaSection";

const Index = () => {
  console.log("Index page rendering");
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
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
