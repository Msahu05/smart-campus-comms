import { motion } from "framer-motion";
import { GraduationCap, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    icon: GraduationCap,
    title: "Student",
    description: "Ask questions, schedule meetings, and get instant AI assistance",
    features: ["AI Assistant", "Find Professors", "View Meetings", "Feedback History"],
    color: "from-accent to-accent-light",
    hoverColor: "group-hover:shadow-[0_0_50px_rgba(6,182,212,0.4)]",
  },
  {
    icon: Users,
    title: "Professor",
    description: "Manage queries, set office hours, and track engagement metrics",
    features: ["Queries Inbox", "Office Hours", "Engagement Stats", "AI Suggestions"],
    color: "from-primary to-primary-light",
    hoverColor: "group-hover:shadow-[0_0_50px_rgba(71,85,105,0.4)]",
  },
  {
    icon: ShieldCheck,
    title: "HOD / Admin",
    description: "Monitor analytics, manage users, and gain AI-powered insights",
    features: ["User Management", "Analytics", "AI Insights", "Reputation Panel"],
    color: "from-primary-light to-accent",
    hoverColor: "group-hover:shadow-[0_0_50px_rgba(139,92,246,0.4)]",
  },
];

const RolesSection = () => {
  const navigate = useNavigate();

  return (
    <section id="roles" className="py-24 px-6 bg-gradient-to-b from-transparent via-muted/30 to-transparent relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
            Choose Your Role
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tailored experiences for every member of your academic institution
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className={`group relative bg-card rounded-3xl p-8 border border-border shadow-medium hover:shadow-large transition-all duration-300 ${role.hoverColor}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`} />
              
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 shadow-large`}
              >
                <role.icon className="w-10 h-10 text-white" />
              </motion.div>

              <h3 className="text-2xl font-bold text-foreground mb-3">
                {role.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {role.description}
              </p>

              <ul className="space-y-3 mb-8">
                {role.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 + idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${role.color}`} />
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <Button 
                className={`w-full bg-gradient-to-r ${role.color} text-white shadow-medium hover:shadow-large hover:scale-105 transition-all duration-300 font-semibold py-6`}
                onClick={() => {
                  if (role.title === "Student") navigate("/student-auth");
                  if (role.title === "Professor") navigate("/professor-auth");
                }}
              >
                Login as {role.title}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
