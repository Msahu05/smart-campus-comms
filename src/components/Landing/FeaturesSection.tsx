import { motion } from "framer-motion";
import { MessageSquare, Calendar, TrendingUp, FileText, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI-Powered Communication",
    description: "Smart query routing with AI assistants handling common questions automatically",
    color: "from-accent to-accent-light",
  },
  {
    icon: Calendar,
    title: "Intelligent Scheduling",
    description: "Auto-scheduled meetings based on mutual availability with calendar integration",
    color: "from-primary to-primary-light",
  },
  {
    icon: TrendingUp,
    title: "Engagement Analytics",
    description: "Track professor responsiveness and student interaction with detailed insights",
    color: "from-accent-light to-primary",
  },
  {
    icon: FileText,
    title: "Smart Summaries",
    description: "AI-generated conversation summaries and meeting notes for easy reference",
    color: "from-primary-light to-accent",
  },
  {
    icon: Shield,
    title: "Verified Access",
    description: "Institutional email verification ensuring secure academic communication",
    color: "from-accent to-primary-light",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Instant notifications and live availability indicators for quick responses",
    color: "from-primary to-accent",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-glow/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need for seamless academic communication in one intelligent platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                rotateY: 5,
                scale: 1.02,
              }}
              className="group relative p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border shadow-soft hover:shadow-large transition-all duration-500"
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
              
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-medium`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </motion.div>

              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
