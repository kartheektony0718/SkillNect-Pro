import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, Mail, GraduationCap, Award, Database, 
  Code2, Zap, ShieldCheck, Cloud, BarChart3,
  Edit2, Save, X, Phone, Loader2, CheckCircle2 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; 
import { toast } from "sonner";
import { motion } from "framer-motion";

// 🏆 Badge Icon Configuration (Synced with Roadmaps)
const TRACK_BADGES: Record<string, any> = {
  "oracle-apex": { icon: Database, label: "Oracle APEX Developer", color: "text-blue-500" },
  "mern-stack": { icon: Code2, label: "MERN Stack Engineer", color: "text-green-500" },
  "ai-specialist": { icon: Zap, label: "AI & LLM Specialist", color: "text-yellow-500" },
  "cyber-sec": { icon: ShieldCheck, label: "Cyber Analyst", color: "text-red-500" },
  "cloud-architect": { icon: Cloud, label: "Cloud Architect", color: "text-orange-500" },
  "data-eng": { icon: BarChart3, label: "Data Engineer", color: "text-purple-500" }
};

const Profile = () => {
  const { user } = useAuth(); 
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  
  const [userData, setUserData] = useState({
    name: "", email: "", phone: "", education: "", gradYear: ""
  });

  // 🚀 THE FIX: AUTH-AWARE PERSISTENCE
  useEffect(() => {
    // Wait for user and email to be fully loaded before checking localStorage
    if (!user || !user.email) return;

    // 1. DYNAMIC BADGE SCANNER (Syncs with LMS completion)
    const trackIds = ["oracle-apex", "mern-stack", "ai-specialist", "cyber-sec", "cloud-architect", "data-eng"];
    const earned = trackIds.filter(id => {
      const progress = localStorage.getItem(`${user.email}_lms_progress_${id}`);
      if (progress) {
        const completed = JSON.parse(progress);
        return completed.length >= 4; // Unlocks only if track is 100% finished
      }
      return false;
    });
    setUnlockedBadges(earned);

    // 2. LOAD PROFILE DATA
    const savedProfile = localStorage.getItem(`${user.email}_profile_data`);
    if (savedProfile) {
      setUserData(JSON.parse(savedProfile));
    } else {
      setUserData({
        name: (user as any)?.name || (user as any)?.displayName || "New User",
        email: user.email,
        phone: "", education: "", gradYear: ""
      });
    }
    console.log(`Profile: Data recovered for ${user.email}`);
  }, [user]); // 🍒 Re-runs automatically once login session is active

  const handleSave = async () => {
    if (!user?.email) return;
    setIsSaving(true);
    try {
      localStorage.setItem(`${user.email}_profile_data`, JSON.stringify(userData));
      setIsEditing(false);
      toast.success("Profile Synchronized", {
        description: "Your professional bio is now locked to your account."
      });
    } catch (err) {
      toast.error("Save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-20 px-4 text-left">
        {/* HEADER SECTION */}
        <div className="relative mb-20">
          <div className="h-48 w-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-[2.5rem] border border-white/5 shadow-inner" />
          
          <div className="absolute -bottom-10 left-10 flex items-end gap-8 w-full pr-20">
            <div className="h-32 w-32 rounded-[2rem] bg-card border-4 border-background flex items-center justify-center overflow-hidden shrink-0 shadow-2xl">
               <User className="h-12 w-12 text-primary" />
            </div>

            <div className="pb-4 flex-1">
              {isEditing ? (
                <div className="space-y-2 mb-2">
                  <Input 
                    value={userData.name} 
                    onChange={(e) => setUserData({...userData, name: e.target.value.toUpperCase()})}
                    placeholder="Full Name"
                    className="bg-white/5 border-primary/30 text-2xl font-black uppercase italic text-white h-10 w-full max-w-md"
                  />
                  <div className="flex gap-4">
                    <Input 
                      value={userData.education} 
                      onChange={(e) => setUserData({...userData, education: e.target.value})}
                      placeholder="Branch (e.g. B.Tech CSE)"
                      className="bg-white/5 border-white/10 text-[10px] h-8 w-48 uppercase font-bold"
                    />
                    <Input 
                      value={userData.gradYear} 
                      onChange={(e) => setUserData({...userData, gradYear: e.target.value})}
                      placeholder="Year (e.g. 2026)"
                      className="bg-white/5 border-white/10 text-[10px] h-8 w-24 uppercase font-bold"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
                    {userData.name || "UNNAMED USER"}
                  </h1>
                  <div className="flex gap-4 mt-2">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" /> {userData.education || "Click Edit to set Degree"}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-primary" /> {userData.gradYear ? `Class of ${userData.gradYear}` : "Set Graduation Year"}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="absolute right-20 bottom-4">
              <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={isSaving} className="bg-primary h-9 px-6 font-black uppercase italic text-[10px] shadow-glow">
                {isSaving ? <Loader2 className="animate-spin h-3 w-3"/> : isEditing ? "Save Profile" : "Edit Bio"}
              </Button>
            </div>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="grid lg:grid-cols-3 gap-10 mt-12">
          <Card className="glass-panel border-white/5 p-8 space-y-6 h-fit">
            <h3 className="text-xs font-black uppercase text-primary tracking-widest border-b border-white/5 pb-2">Verified Contact</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Gmail</label>
                <p className="text-sm text-white/80">{userData.email}</p>
              </div>
              <div>
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Phone</label>
                {isEditing ? (
                  <Input 
                    value={userData.phone} 
                    onChange={e => setUserData({...userData, phone: e.target.value})} 
                    placeholder="Enter Phone"
                    className="h-8 bg-white/5 border-white/10 text-xs" 
                  />
                ) : (
                  <p className="text-sm text-white/80">{userData.phone || "No phone added"}</p>
                )}
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black uppercase italic text-white mb-8 flex items-center gap-3">
              <Award className="h-6 w-6 text-primary" /> Track Badges
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {unlockedBadges.length > 0 ? unlockedBadges.map((badgeId) => {
                const Badge = TRACK_BADGES[badgeId];
                return (
                  <motion.div 
                    key={badgeId} 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="p-6 rounded-[2rem] bg-white/5 border border-primary/20 flex flex-col items-center gap-3 text-center group hover:border-primary/50 transition-all shadow-glow"
                  >
                    <Badge.icon className={`h-8 w-8 ${Badge.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white leading-tight">{Badge.label}</span>
                  </motion.div>
                );
              }) : (
                <div className="col-span-3 py-16 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center">
                   <Award className="h-10 w-10 text-white/5 mb-2" />
                   <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Complete roadmaps to unlock badges</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;