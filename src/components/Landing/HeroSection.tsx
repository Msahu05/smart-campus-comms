import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, Network } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-subtle">
      {/* Animated 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating 3D Elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-16 h-16 bg-gradient-primary rounded-xl shadow-medium"
        animate={{
          y: [0, -20, 0],
          rotateZ: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transform: "perspective(1000px) rotateX(20deg)" }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-12 h-12 bg-accent rounded-full shadow-glow"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-glow/30 backdrop-blur-sm border border-accent/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">AI-Powered Academic Hub</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-br from-primary via-primary-light to-accent bg-clip-text text-transparent leading-tight"
        >
          EduLink.AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          The Intelligent Academic Communication Hub connecting students and professors
          through verified, structured, and AI-powered interactions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          <div className="flex items-center gap-3 px-6 py-3 bg-card/80 backdrop-blur-sm rounded-lg border border-border shadow-soft">
            <Brain className="w-5 h-5 text-accent" />
            <span className="text-foreground font-medium">Smart AI Routing</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-card/80 backdrop-blur-sm rounded-lg border border-border shadow-soft">
            <Network className="w-5 h-5 text-primary" />
            <span className="text-foreground font-medium">Verified Network</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            className="bg-gradient-primary text-primary-foreground shadow-medium hover:shadow-large transition-all duration-300 px-8 py-6 text-lg font-semibold"
          >
            Explore Platform
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5 px-8 py-6 text-lg font-semibold transition-all duration-300"
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-2 bg-accent rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
