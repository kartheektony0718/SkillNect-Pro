import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Briefcase,
  Code2,
  MessageSquare,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Download,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI Resume Builder",
    description: "Create ATS-optimized resumes with AI-powered suggestions, keyword optimization, and professional templates.",
  },
 
  {
    icon: MessageSquare,
    title: "AI Interview Bot",
    description: "Practice with realistic mock interviews. Get scored on confidence, communication, and technical depth.",
  },
  {
    icon: Users,
    title: "Expert Match",
    description: "Connect with mentors, get career guidance, book mock interviews, and bridge your skill gaps.",
  },
  {
    icon: Star,
    title: "Smart Dashboard",
    description: "Track your progress across resumes, interviews, learning paths, and get personalized recommendations.",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-display font-bold">SkillNect AI</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
              <Download className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">Get Started</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary-foreground/80 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Zap className="h-3.5 w-3.5" />
              AI-Powered Career Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-primary-foreground mb-6 leading-tight">
              Build Your Career
              <span className="block text-gradient-accent">With Intelligence</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/60 max-w-2xl mx-auto mb-10">
              Create ATS-optimized resumes, practice AI-powered interviews, master programming, and connect with expert mentors — all in one platform.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button variant="hero" size="xl" onClick={() => navigate("/auth")}>
                Start for Free <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="glass" size="xl" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                See Features
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Resumes Built" },
              { value: "95%", label: "ATS Pass Rate" },
              { value: "5K+", label: "Interviews Aced" },
              { value: "500+", label: "Mentors Active" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-display font-bold text-gradient-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need to <span className="text-gradient-primary">Land Your Dream Job</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From resume building to interview prep, we've got every step of your career journey covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:shadow-glow hover:border-primary/30 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-3xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Ready to Forge Your Career?
            </h2>
            <p className="text-lg text-primary-foreground/60 mb-8">
              Join thousands of job seekers who've already accelerated their careers with CareerForge AI.
            </p>
            <Button variant="hero" size="xl" onClick={() => navigate("/auth")}>
              Get Started — It's Free <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span>SkillNect AI</span>
          </div>
          <p className="text-xs sm:text-sm">© 2026 Skill Nect AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
