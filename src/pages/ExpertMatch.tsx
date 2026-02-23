import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Users,
  Star,
  MessageSquare,
  Calendar,
  Target,
  Award,
} from "lucide-react";

const mentors = [
  { name: "Sarah Chen", role: "Senior SWE @ Google", rating: 4.9, specialty: "System Design", avatar: "👩‍💻" },
  { name: "Raj Patel", role: "Tech Lead @ Microsoft", rating: 4.8, specialty: "Backend", avatar: "👨‍💻" },
  { name: "Emily Johnson", role: "Staff Engineer @ Meta", rating: 4.9, specialty: "Frontend", avatar: "👩‍🔬" },
  { name: "James Wilson", role: "SDE III @ Amazon", rating: 4.7, specialty: "DSA", avatar: "🧑‍💻" },
];

const ExpertMatch = () => {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">Expert Match</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Connect with mentors and accelerate your career</p>
          </div>
          <Button variant="hero" className="w-full sm:w-auto">
            <Target className="h-4 w-4" /> AI Career Analysis
          </Button>
        </div>

        {/* Skill Gap Card */}
        <div className="bg-gradient-hero rounded-xl p-6 mb-8 text-primary-foreground">
          <h2 className="font-display font-bold text-lg mb-2">AI Skill Gap Analysis</h2>
          <p className="text-primary-foreground/60 text-sm mb-4">Complete your profile to get personalized mentor recommendations and identify skill gaps.</p>
          <Button variant="glass" size="sm">Complete Profile</Button>
        </div>

        {/* Mentors */}
        <h2 className="text-lg font-display font-semibold mb-4">Available Mentors</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {mentors.map((mentor, i) => (
            <motion.div
              key={mentor.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{mentor.avatar}</div>
                <div className="flex-1">
                  <h3 className="font-semibold">{mentor.name}</h3>
                  <p className="text-sm text-muted-foreground">{mentor.role}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> {mentor.rating}
                    </span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{mentor.specialty}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm"><MessageSquare className="h-3 w-3" /> Chat</Button>
                    <Button variant="default" size="sm"><Calendar className="h-3 w-3" /> Book Session</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ExpertMatch;
