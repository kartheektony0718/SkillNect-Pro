import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Database, Code2, Zap, ShieldCheck, Cloud, BarChart3,
  Play, Pause, RotateCcw, Maximize, X, CheckCircle2, 
  Lock, PlayCircle, MonitorPlay, Trophy, ChevronRight 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// --- LMS ROADMAP DATA ---
const ROADMAPS = [
  {
    id: "oracle-apex",
    title: "Oracle APEX Expert",
    icon: Database,
    color: "text-blue-500",
    modules: [
      { id: 101, title: "SQL & PL/SQL Basics", videoId: "7S_tz1z_5bA", desc: "Foundational database logic." },
      { id: 102, title: "App Builder Core", videoId: "wGclLp65RWQ", desc: "UI development in APEX." },
      { id: 103, title: "Dynamic Actions", videoId: "9nLshT49XN8", desc: "Interactive frontend logic." },
      { id: 104, title: "REST Services", videoId: "3v8X6B-O2r0", desc: "ORDS and API integration." }
    ]
  },
  {
    id: "mern-stack",
    title: "MERN Stack Pro",
    icon: Code2,
    color: "text-green-500",
    modules: [
      { id: 201, title: "React State", videoId: "Ke90Tje7VS0", desc: "Hooks and context management." },
      { id: 202, title: "Node.js API", videoId: "fBNz5xF-Kx4", desc: "Express server architecture." },
      { id: 203, title: "MongoDB Design", videoId: "O6Xo21L0ybE", desc: "Schema design and NoSQL." },
      { id: 204, title: "Deployment", videoId: "7CqJlxBYj-M", desc: "Production launch and Auth." }
    ]
  },
  {
    id: "ai-specialist",
    title: "AI Specialist",
    icon: Zap,
    color: "text-yellow-500",
    modules: [
      { id: 301, title: "Python for AI", videoId: "rfscVS0vtbw", desc: "NumPy and Pandas basics." },
      { id: 302, title: "LLM Engineering", videoId: "v_Wl61vTzGk", desc: "GPT and Gemini integration." },
      { id: 303, title: "Vector DBs", videoId: "klTvEwg3oJ4", desc: "RAG and Semantic Search." },
      { id: 304, title: "AI Agents", videoId: "G7m8F8lYQ3U", desc: "Building autonomous systems." }
    ]
  },
  {
    id: "cyber-sec",
    title: "Cyber Analyst",
    icon: ShieldCheck,
    color: "text-red-500",
    modules: [
      { id: 401, title: "Networking Essentials", videoId: "bjvN9-8zF9U", desc: "TCP/IP and secure protocols." },
      { id: 402, title: "Ethical Hacking", videoId: "dz7Ntp7KQ8c", desc: "Penetration testing basics." },
      { id: 403, title: "Linux Security", videoId: "lA79p3D7O0g", desc: "System hardening and Bash." },
      { id: 404, title: "SOC Operations", videoId: "z8m2C6x8x7U", desc: "Threat hunting and analysis." }
    ]
  },
  {
    id: "cloud-architect",
    title: "Cloud Architect",
    icon: Cloud,
    color: "text-orange-500",
    modules: [
      { id: 501, title: "Cloud Fundamentals", videoId: "mZ_78D0u9_M", desc: "IAAS, PAAS, and SAAS models." },
      { id: 502, title: "AWS Architecture", videoId: "ulprqHHWnxQ", desc: "EC2, S3, and VPC design." },
      { id: 503, title: "Serverless Computing", videoId: "9S_6B8zC8zU", desc: "AWS Lambda and API Gateway." },
      { id: 504, title: "Cloud Migration", videoId: "n4_nS_B6o8E", desc: "Moving enterprise workloads." }
    ]
  },
  {
    id: "data-eng",
    title: "Data Engineering",
    icon: BarChart3,
    color: "text-purple-500",
    modules: [
      { id: 601, title: "Advanced SQL", videoId: "7S_tz1z_5bA", desc: "Optimizing database queries." },
      { id: 602, title: "ETL Pipelines", videoId: "ulprqHHWnxQ", desc: "Data orchestration basics." },
      { id: 603, title: "Apache Spark", videoId: "qW2XU-S8vN0", desc: "Big Data processing engine." },
      { id: 604, title: "Data Warehousing", videoId: "9nLshT49XN8", desc: "Snowflake and BigQuery." }
    ]
  }
];

const Roadmaps = () => {
  const { user } = useAuth();
  const [activeTrack, setActiveTrack] = useState(ROADMAPS[0]);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 🚀 UPDATED PERSISTENCE LOGIC (Fixes the login/reload reset)
  useEffect(() => {
    // Wait for user and email to be fully loaded before checking localStorage
    if (!user || !user.email) return;

    const storageKey = `${user.email}_lms_progress_${activeTrack.id}`;
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      setCompletedModules(JSON.parse(saved));
    } else {
      setCompletedModules([]);
    }
  }, [user, activeTrack]); // Adding 'user' to the dependency array ensures re-run on login

  // YouTube API Script Injection
  useEffect(() => {
    if (!activeVideo) return;
    const loadVideo = () => {
      playerRef.current = new (window as any).YT.Player("lms-player", {
        videoId: activeVideo,
        playerVars: { autoplay: 1, controls: 0, disablekb: 1, modestbranding: 1, rel: 0 },
        events: {
          onReady: (e: any) => e.target.playVideo(),
          onStateChange: (e: any) => setIsPlaying(e.data === (window as any).YT.PlayerState.PLAYING),
        },
      });
    };

    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = loadVideo;
    } else {
      loadVideo();
    }
    return () => playerRef.current?.destroy();
  }, [activeVideo]);

  const finishModule = (moduleId: number, index: number) => {
    if (!user?.email) return;
    if (index > 0 && !completedModules.includes(activeTrack.modules[index - 1].id)) {
      toast.error("Finish previous module first!"); return;
    }
    
    const newProgress = [...completedModules, moduleId];
    setCompletedModules(newProgress);
    
    // 🍒 SAVES TO THE UNIVERSAL CERTIFICATION BRIDGE KEY
    localStorage.setItem(`${user.email}_lms_progress_${activeTrack.id}`, JSON.stringify(newProgress));
    
    if (newProgress.length === activeTrack.modules.length) {
      toast.success("Course Certified!", { description: "Credential unlocked in the Hub." });
    } else {
      toast.success(`Module ${index + 1} Cleared!`);
    }
  };

  const togglePlay = () => {
    isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
    setIsPlaying(!isPlaying);
  };
  const goBack = () => playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10, true);
  const toggleFull = () => containerRef.current?.requestFullscreen();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-20 px-4 text-left">
        <header className="mb-10">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white">LMS Portal</h1>
          <p className="text-primary font-bold tracking-[0.3em] text-[10px] mt-1 uppercase">Sequential Industry Roadmaps</p>
        </header>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* TRACK SELECTOR */}
          <div className="lg:col-span-1 space-y-3">
            {ROADMAPS.map((track) => (
              <button 
                key={track.id} 
                onClick={() => setActiveTrack(track)} 
                className={`w-full p-4 rounded-2xl flex items-center gap-4 border transition-all ${
                  activeTrack.id === track.id ? "bg-primary/10 border-primary/30 shadow-glow" : "bg-white/5 border-white/5 opacity-50"
                }`}
              >
                <track.icon className={`h-5 w-5 ${activeTrack.id === track.id ? track.color : ""}`} />
                <span className="text-[10px] font-black uppercase tracking-tight">{track.title}</span>
              </button>
            ))}
          </div>

          {/* MODULE LIST */}
          <div className="lg:col-span-3 space-y-6">
             <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">{activeTrack.title}</h2>
                <span className="text-primary font-bold text-[10px] uppercase">
                  {Math.round((completedModules.length / activeTrack.modules.length) * 100)}% Finished
                </span>
             </div>

             {activeTrack.modules.map((module, index) => {
               const isDone = completedModules.includes(module.id);
               const isLocked = index > 0 && !completedModules.includes(activeTrack.modules[index-1].id);
               
               return (
                 <Card key={module.id} className={`glass-panel p-6 border-white/5 relative ${isLocked ? 'opacity-30 pointer-events-none' : 'hover:border-primary/20'}`}>
                    <div className="flex justify-between items-center">
                       <div className="flex gap-4 items-center">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center border transition-all ${
                            isDone ? 'bg-primary border-primary shadow-glow' : 'border-white/10'
                          }`}>
                             {isDone ? <CheckCircle2 className="h-5 w-5 text-white"/> : isLocked ? <Lock className="h-4 w-4 text-white/20"/> : <PlayCircle className="h-5 w-5 text-primary animate-pulse"/>}
                          </div>
                          <div>
                            <h4 className="font-bold text-white uppercase text-sm italic tracking-tight">{module.title}</h4>
                            <p className="text-[10px] text-muted-foreground">{module.desc}</p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <Button onClick={() => setActiveVideo(module.videoId)} variant="outline" className="h-9 text-[9px] uppercase font-bold border-white/10 hover:bg-white/5">
                            Lesson
                          </Button>
                          <Button 
                            disabled={isDone || isLocked} 
                            onClick={() => finishModule(module.id, index)} 
                            className={`h-9 px-6 text-[9px] font-black uppercase italic transition-all ${
                              isDone ? 'bg-white/10 text-white/30' : 'bg-primary shadow-glow hover:scale-105'
                            }`}
                          >
                            {isDone ? "Cleared" : "Finish"}
                          </Button>
                       </div>
                    </div>
                 </Card>
               );
             })}
          </div>
        </div>

        {/* 🎬 SECURE CUSTOM PLAYER MODAL */}
        <AnimatePresence>
          {activeVideo && (
            <div className="fixed inset-0 z-[100] bg-black/98 flex flex-col items-center justify-center p-4">
              <button onClick={() => setActiveVideo(null)} className="absolute top-8 right-8 text-white hover:text-primary transition-all">
                <X className="h-10 w-10"/>
              </button>
              
              <div ref={containerRef} className="w-full max-w-5xl aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-glow relative group">
                <div id="lms-player" className="w-full h-full pointer-events-none" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all flex justify-between items-center">
                   <div className="flex gap-4">
                      <Button onClick={togglePlay} className="rounded-full h-12 w-12 bg-primary shadow-glow text-white">
                        {isPlaying ? <Pause className="h-6 w-6"/> : <Play className="h-6 w-6"/>}
                      </Button>
                      <Button onClick={goBack} className="rounded-full h-12 w-12 bg-white/10 border border-white/10 text-white hover:bg-white/20">
                        <RotateCcw className="h-5 w-5"/>
                      </Button>
                   </div>
                   
                   <div className="flex items-center gap-6">
                      <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] animate-pulse">LMS Shield Active</p>
                      <Button onClick={toggleFull} className="rounded-full h-12 w-12 bg-white/10 border border-white/10 text-white hover:bg-white/20">
                        <Maximize className="h-5 w-5"/>
                      </Button>
                   </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Roadmaps;