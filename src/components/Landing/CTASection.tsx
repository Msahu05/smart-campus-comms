import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-accent opacity-90" />
      
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-accent-light/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-primary-light/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your Academic Communication?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of institutions already using EduLink.AI to create more efficient,
            transparent, and engaging academic environments.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-large hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg font-semibold group"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold transition-all duration-300"
            >
              Schedule a Demo
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-white/80"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span>Free 30-day trial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span>24/7 support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
