import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, ShieldCheck, X, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Certifications = () => {
  const { user } = useAuth();
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [unlockedCerts, setUnlockedCerts] = useState<any[]>([]);
  const [profileData, setProfileData] = useState({ name: "", education: "", gradYear: "" });
  const [isDownloading, setIsDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const CERT_MAPPING = [
    { id: "oracle-apex", name: "Oracle APEX Cloud Developer" },
    { id: "mern-stack", name: "MERN Stack Professional" },
    { id: "ai-specialist", name: "Generative AI Specialist" },
    { id: "cyber-sec", name: "Cybersecurity Analyst" },
    { id: "cloud-architect", name: "Cloud Architect" },
    { id: "data-eng", name: "Data Engineer" }
  ];

  // 🚀 UPDATED PERSISTENCE LOGIC
  useEffect(() => {
    // Wait for user and email to be fully loaded before checking localStorage
    if (!user || !user.email) return;

    // 1. Load Profile Data for personalization
    const savedProfile = localStorage.getItem(`${user.email}_profile_data`);
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }

    // 2. Sync with Roadmaps (Checks completion of 4 modules)
    const earned = CERT_MAPPING.filter(cert => {
      const progress = localStorage.getItem(`${user.email}_lms_progress_${cert.id}`);
      if (progress) {
        const completed = JSON.parse(progress);
        // Only unlock if the track is actually finished (4 modules)
        return completed.length >= 4; 
      }
      return false;
    }).map(cert => ({
      ...cert,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }));

    setUnlockedCerts(earned);
    console.log(`Credentials: Recovered ${earned.length} certificates for ${user.email}`);
  }, [user]); // 🍒 Re-runs automatically the moment 'user' session is confirmed

  // 🚀 HIGH-RES PDF DOWNLOAD ENGINE
  const downloadCertificate = async () => {
    if (!certRef.current || !selectedCert) return;
    
    setIsDownloading(true);
    const tid = toast.loading("Verifying credentials and generating PDF...");

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 4, // Ultra-high resolution
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4"); // Landscape orientation
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${selectedCert.name.replace(/\s+/g, '_')}_Certificate.pdf`);
      
      toast.dismiss(tid);
      toast.success("Certificate Downloaded Successfully!");
    } catch (err) {
      toast.dismiss(tid);
      toast.error("Generation failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-20 px-4 text-left">
        <header className="mb-12">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white">Credentials</h1>
          <p className="text-primary font-bold tracking-[0.3em] text-[10px] mt-1 uppercase">Verified Professional Achievements</p>
        </header>

        {unlockedCerts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedCerts.map((cert) => (
              <Card key={cert.id} className="glass-panel p-6 border-white/5 hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <Award className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                  <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>
                <h3 className="text-lg font-black uppercase italic text-white mb-6 leading-tight">{cert.name}</h3>
                <Button onClick={() => setSelectedCert(cert)} className="w-full bg-primary font-black uppercase italic text-[10px] shadow-glow">
                  View & Download
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
            <Lock className="h-12 w-12 text-white/10 mx-auto mb-4" />
            <h3 className="text-white font-black uppercase italic">Locked Credentials</h3>
            <p className="text-muted-foreground uppercase font-bold text-[10px] mt-2">Complete all modules in a roadmap to unlock</p>
          </div>
        )}

        {/* 🚀 CERTIFICATE PREVIEW & DOWNLOAD MODAL */}
        <AnimatePresence>
          {selectedCert && (
            <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-md flex items-center justify-center p-4">
              <div className="w-full max-w-5xl relative">
                <button onClick={() => setSelectedCert(null)} className="absolute -top-12 right-0 text-white hover:text-primary transition-all">
                  <X className="h-10 w-10"/>
                </button>
                
                {/* PDF CAPTURE AREA */}
                <div className="overflow-hidden rounded-sm shadow-2xl">
                  <div 
                    ref={certRef} 
                    className="bg-white text-black p-20 w-[297mm] h-[210mm] mx-auto flex flex-col items-center justify-center text-center border-[15px] border-double border-gray-200 relative"
                  >
                    {/* Security Watermark */}
                    <ShieldCheck className="absolute -bottom-10 -right-10 h-80 w-80 text-gray-50 opacity-60 rotate-12" />
                    
                    <div className="relative z-10 space-y-8 w-full max-w-3xl">
                      <div className="space-y-2">
                        <h4 className="text-primary font-black uppercase tracking-[0.5em] text-sm">Certificate of Achievement</h4>
                        <div className="h-1 w-20 bg-primary mx-auto" />
                      </div>
                      
                      <p className="text-gray-400 text-xs uppercase font-bold tracking-widest">This is to officially recognize</p>
                      
                      <div className="py-6 border-y border-gray-100">
                        <h2 className="text-6xl font-serif italic font-bold text-gray-900 tracking-tight">
                          {(profileData.name || (user as any)?.displayName || "SkillNect Learner").toUpperCase()}
                        </h2>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">
                          Candidate from <span className="font-black text-black">{profileData.education || "SkillNect AI Academy"}</span>
                        </p>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                          {profileData.gradYear ? `Verified Member • Class of ${profileData.gradYear}` : "Verified Professional Member"}
                        </p>
                      </div>

                      <div className="pt-8">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">For successfully mastering the track</p>
                        <h3 className="text-3xl font-black uppercase italic tracking-tighter mt-2">{selectedCert.name}</h3>
                      </div>

                      <div className="pt-16 flex justify-between items-end px-10">
                        <div className="text-left">
                          <p className="text-[9px] font-black uppercase text-gray-300">Issue Date</p>
                          <p className="text-sm font-bold">{selectedCert.issueDate}</p>
                        </div>
                        <div className="text-right border-t border-black pt-2 min-w-[200px]">
                           <p className="text-xs font-serif italic text-gray-800">SkillNect AI Verification Engine</p>
                           <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">ID: SN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-6">
                  <Button 
                    onClick={downloadCertificate} 
                    disabled={isDownloading}
                    className="bg-primary h-16 px-16 font-black uppercase italic shadow-glow flex gap-3 text-white"
                  >
                    {isDownloading ? <Loader2 className="animate-spin" /> : <Download className="h-5 w-5" />}
                    {isDownloading ? "Architecting PDF..." : "Download Verified Certificate"}
                  </Button>
                  <Button 
                    onClick={() => setSelectedCert(null)}
                    variant="ghost" 
                    className="h-16 px-8 uppercase font-bold text-xs text-white border border-white/10"
                  >
                    Back to Hub
                  </Button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Certifications;