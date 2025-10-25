import HeroSection from "@/components/Landing/HeroSection";
import FeaturesSection from "@/components/Landing/FeaturesSection";
import RolesSection from "@/components/Landing/RolesSection";
import StatsSection from "@/components/Landing/StatsSection";
import CTASection from "@/components/Landing/CTASection";
import Footer from "@/components/Landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <RolesSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
