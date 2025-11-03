import { Brain } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-medium">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EduLink.AI
            </span>
          </div>

          <div className="text-center text-muted-foreground text-sm">
            <p>© 2025 EduLink.AI. All rights reserved.</p>
            <p className="mt-1">Intelligent Academic Communication Platform</p>
          </div>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-accent transition-colors duration-300">Privacy</a>
            <a href="#" className="hover:text-accent transition-colors duration-300">Terms</a>
            <a href="#" className="hover:text-accent transition-colors duration-300">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
