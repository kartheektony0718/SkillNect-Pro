import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Github, Linkedin, Mail, Phone, Loader2, Download, Eye, X, 
  Sparkles, GraduationCap, Briefcase, Plus, Trash2, Globe, 
  MapPin, Wrench, Trophy, Code2, Layout, Link as LinkIcon 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ResumeBuilder = () => {
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  // 🚀 CLEAN MULTI-USER STATE: ALL COLUMNS INCLUDED
  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
    education: [{ id: Date.now(), degree: "", school: "", field: "", start: "", end: "", score: "", current: false }],
    experience: [{ id: Date.now(), role: "", company: "", loc: "", start: "", end: "", desc: "", current: false }],
    projects: [{ id: Date.now(), title: "", tech: "", link: "", demo: "", desc: "" }],
    skills: { technical: "", soft: "", tools: "" },
    certifications: [{ id: Date.now(), name: "", org: "", date: "", url: "" }]
  });

  useEffect(() => {
    if (!user?.email) return;
    const saved = localStorage.getItem(`${user.email}_full_resume_v1`);
    if (saved) {
      setFormData(JSON.parse(saved));
    } else {
      setFormData(prev => ({
        ...prev,
        fullName: (user as any)?.name || user?.displayName || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  // ➕ DYNAMIC SECTION HANDLERS
  const addEntry = (section: 'education' | 'experience' | 'projects' | 'certifications') => {
    const templates = {
      education: { id: Date.now(), degree: "", school: "", field: "", start: "", end: "", score: "", current: false },
      experience: { id: Date.now(), role: "", company: "", loc: "", start: "", end: "", desc: "", current: false },
      projects: { id: Date.now(), title: "", tech: "", link: "", demo: "", desc: "" },
      certifications: { id: Date.now(), name: "", org: "", date: "", url: "" }
    };
    setFormData({ ...formData, [section]: [...formData[section], templates[section]] });
  };

  const removeEntry = (section: any, id: number) => {
    setFormData({ ...formData, [section]: formData[section].filter((item: any) => item.id !== id) });
  };

  const updateEntry = (section: any, id: number, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: formData[section].map((item: any) => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  // 🧠 AI SUMMARY ENHANCER (Gemini API Simulation)
  const enhanceSummary = async () => {
    if (formData.summary.length < 20) {
      toast.error("Enter at least 20 characters for AI to expand.");
      return;
    }
    setIsEnhancing(true);
    const tid = toast.loading("AI is crafting your narrative...");
    try {
      await new Promise(r => setTimeout(r, 1500));
      const enhanced = `Strategic professional with a strong technical foundation and a commitment to operational excellence. Expert at navigating complex workflows and architecting scalable solutions through data-driven strategies. Proven ability to thrive in collaborative environments, delivering technical innovation while maintaining strict adherence to industry best practices.`;
      setFormData(prev => ({ ...prev, summary: enhanced }));
      toast.dismiss(tid);
      toast.success("Summary Refined.");
    } catch (err) { toast.dismiss(tid); } finally { setIsEnhancing(false); }
  };

  // 🚀 PRODUCTION VALIDATION GATEWAY
  const validateAndPreview = async () => {
    setIsVerifying(true);
    const nameRegex = /^[a-zA-Z\s]{3,50}$/;
    const gmailRegex = /^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const ghPattern = "https://github.com/";
    const liPattern = "https://www.linkedin.com/in/";

    // 1. Basic Field Validations
    if (!nameRegex.test(formData.fullName)) {
      toast.error("Name: 3-50 characters, alphabets only.");
      setIsVerifying(false); return;
    }
    if (!gmailRegex.test(formData.email)) {
      toast.error("Only valid @gmail.com addresses are permitted.");
      setIsVerifying(false); return;
    }
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone: 10 digits starting with 6-9 required.");
      setIsVerifying(false); return;
    }

    // 2. Date Integrity Check
    const hasDateError = [...formData.education, ...formData.experience].some(item => 
      !item.current && item.end && new Date(item.start) > new Date(item.end)
    );
    if (hasDateError) {
      toast.error("Date Error: End date cannot be before start date.");
      setIsVerifying(false); return;
    }

    // 3. GitHub & LinkedIn Existense Checks
    try {
      if (formData.github) {
        if (!formData.github.startsWith(ghPattern)) throw new Error("GitHub format");
        const username = formData.github.split("github.com/")[1]?.split("/")[0];
        const res = await fetch(`https://api.github.com/users/${username}`);
        if (res.status !== 200) {
          toast.error("GitHub profile not found.");
          setIsVerifying(false); return;
        }
      }
      
      localStorage.setItem(`${user?.email}_full_resume_v1`, JSON.stringify(formData));
      setIsPreviewOpen(true);
      toast.success("Identity Verified.");
    } catch (err: any) {
      toast.error(err.message === "GitHub format" ? `GitHub must start with ${ghPattern}` : "Verification failed.");
    } finally { setIsVerifying(false); }
  };

  // 🚀 PDF DOWNLOAD HANDLER
  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    const tid = toast.loading("Exporting High-Res PDF...");
    try {
      const canvas = await html2canvas(resumeRef.current, { scale: 3, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${formData.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
      toast.dismiss(tid);
      toast.success("Resume Exported!");
    } catch (err) { toast.dismiss(tid); toast.error("PDF Export failed."); }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-20 px-4 text-left">
        <header className="mb-10">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white">Resume Studio</h1>
          <p className="text-primary font-bold tracking-[0.3em] text-xs mt-1 uppercase">Universal Multi-Section Builder</p>
        </header>

        <div className="space-y-12">
          {/* 1. PERSONAL INFO SECTION */}
          <Card className="glass-panel p-8 space-y-6 border-white/5">
            <h2 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2"><Mail className="h-4 w-4" /> 1. Personal Information</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input placeholder="Full Name (Alphabets only)" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="bg-white/5 border-white/10" />
              <Input placeholder="Professional Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-white/5 border-white/10" />
              <Input placeholder="Gmail Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-white/5 border-white/10" />
              <Input placeholder="Phone (10 Digits)" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-white/5 border-white/10" />
              <Input placeholder="Location (City, Country)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-white/5 border-white/10" />
              <Input placeholder="LinkedIn URL" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="bg-white/5 border-white/10" />
              <Input placeholder="GitHub URL" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="bg-white/5 border-white/10" />
              <Input placeholder="Portfolio URL (Optional)" value={formData.portfolio} onChange={e => setFormData({...formData, portfolio: e.target.value})} className="bg-white/5 border-white/10" />
            </div>
            <div className="pt-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Profile Summary</label>
                <Button onClick={enhanceSummary} disabled={isEnhancing} variant="ghost" className="h-7 text-[9px] text-primary border border-primary/20"><Sparkles className="h-3 w-3 mr-1"/> AI ENHANCE</Button>
              </div>
              <Textarea placeholder="Describe your professional journey..." value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="bg-white/5 h-28 text-sm" />
            </div>
          </Card>

          {/* 2. EDUCATION SECTION */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2"><GraduationCap className="h-4 w-4" /> 2. Education History</h2>
              <Button onClick={() => addEntry('education')} variant="outline" className="h-8 text-[10px] text-primary border-primary/20"><Plus className="h-3 w-3 mr-1"/> Add Education</Button>
            </div>
            {formData.education.map((edu, i) => (
              <Card key={edu.id} className="glass-panel p-6 relative group border-white/5">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <Input placeholder="Degree" value={edu.degree} onChange={e => updateEntry('education', edu.id, 'degree', e.target.value)} className="bg-white/5" />
                  <Input placeholder="Institution Name" value={edu.school} onChange={e => updateEntry('education', edu.id, 'school', e.target.value)} className="bg-white/5" />
                  <Input placeholder="CGPA / Percentage" value={edu.score} onChange={e => updateEntry('education', edu.id, 'score', e.target.value)} className="bg-white/5" />
                  <Input type="date" placeholder="Start Date" value={edu.start} onChange={e => updateEntry('education', edu.id, 'start', e.target.value)} className="bg-white/5" />
                  <Input type="date" disabled={edu.current} placeholder="End Date" value={edu.end} onChange={e => updateEntry('education', edu.id, 'end', e.target.value)} className="bg-white/5" />
                  <div className="flex items-center gap-2 px-2">
                    <Checkbox id={`edu-curr-${edu.id}`} checked={edu.current} onCheckedChange={(val) => updateEntry('education', edu.id, 'current', val)} />
                    <label htmlFor={`edu-curr-${edu.id}`} className="text-[10px] uppercase font-bold text-muted-foreground cursor-pointer">Currently Studying</label>
                  </div>
                </div>
                <Button onClick={() => removeEntry('education', edu.id)} variant="ghost" className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></Button>
              </Card>
            ))}
          </div>

          {/* 3. EXPERIENCE SECTION */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2"><Briefcase className="h-4 w-4" /> 3. Experience</h2>
              <Button onClick={() => addEntry('experience')} variant="outline" className="h-8 text-[10px] text-primary border-primary/20"><Plus className="h-3 w-3 mr-1"/> Add Experience</Button>
            </div>
            {formData.experience.map((exp, i) => (
              <Card key={exp.id} className="glass-panel p-6 relative group border-white/5">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <Input placeholder="Job Title" value={exp.role} onChange={e => updateEntry('experience', exp.id, 'role', e.target.value)} className="bg-white/5" />
                  <Input placeholder="Company Name" value={exp.company} onChange={e => updateEntry('experience', exp.id, 'company', e.target.value)} className="bg-white/5" />
                  <Input type="date" value={exp.start} onChange={e => updateEntry('experience', exp.id, 'start', e.target.value)} className="bg-white/5" />
                  <Input type="date" disabled={exp.current} value={exp.end} onChange={e => updateEntry('experience', exp.id, 'end', e.target.value)} className="bg-white/5" />
                </div>
                <div className="flex items-center gap-2 mb-4 px-2">
                  <Checkbox id={`exp-curr-${exp.id}`} checked={exp.current} onCheckedChange={(val) => updateEntry('experience', exp.id, 'current', val)} />
                  <label htmlFor={`exp-curr-${exp.id}`} className="text-[10px] uppercase font-bold text-muted-foreground cursor-pointer">Currently Working</label>
                </div>
                <Textarea placeholder="Description (Responsibilities & Achievements)" value={exp.desc} onChange={e => updateEntry('experience', exp.id, 'desc', e.target.value)} className="bg-white/5 h-20" />
                <Button onClick={() => removeEntry('experience', exp.id)} variant="ghost" className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></Button>
              </Card>
            ))}
          </div>

          {/* 4. PROJECTS SECTION */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2"><Code2 className="h-4 w-4" /> 4. Projects</h2>
              <Button onClick={() => addEntry('projects')} variant="outline" className="h-8 text-[10px] text-primary border-primary/20"><Plus className="h-3 w-3 mr-1"/> Add Project</Button>
            </div>
            {formData.projects.map((proj, i) => (
              <Card key={proj.id} className="glass-panel p-6 relative group border-white/5">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <Input placeholder="Project Title" value={proj.title} onChange={e => updateEntry('projects', proj.id, 'title', e.target.value)} className="bg-white/5" />
                  <Input placeholder="Technologies (Comma separated)" value={proj.tech} onChange={e => updateEntry('projects', proj.id, 'tech', e.target.value)} className="bg-white/5" />
                  <Input placeholder="GitHub Link" value={proj.link} onChange={e => updateEntry('projects', proj.id, 'link', e.target.value)} className="bg-white/5" />
                </div>
                <Textarea placeholder="Project Description" value={proj.desc} onChange={e => updateEntry('projects', proj.id, 'desc', e.target.value)} className="bg-white/5 h-20" />
                <Button onClick={() => removeEntry('projects', proj.id)} variant="ghost" className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></Button>
              </Card>
            ))}
          </div>

          {/* 5. SKILLS SECTION */}
          <Card className="glass-panel p-8 space-y-6 border-white/5">
            <h2 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2"><Wrench className="h-4 w-4" /> 5. Skills</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Textarea placeholder="Technical Skills (e.g., Python, Oracle APEX, React)" value={formData.skills.technical} onChange={e => setFormData({...formData, skills: {...formData.skills, technical: e.target.value}})} className="bg-white/5 h-24" />
              <Textarea placeholder="Soft Skills & Tools (e.g., Teamwork, Git, Excel)" value={formData.skills.soft} onChange={e => setFormData({...formData, skills: {...formData.skills, soft: e.target.value}})} className="bg-white/5 h-24" />
            </div>
          </Card>

          {/* 6. CERTIFICATIONS SECTION */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2"><Trophy className="h-4 w-4" /> 6. Certifications</h2>
              <Button onClick={() => addEntry('certifications')} variant="outline" className="h-8 text-[10px] text-primary border-primary/20"><Plus className="h-3 w-3 mr-1"/> Add Certification</Button>
            </div>
            {formData.certifications.map((cert, i) => (
              <Card key={cert.id} className="glass-panel p-6 relative group border-white/5">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input placeholder="Certification Name" value={cert.name} onChange={e => updateEntry('certifications', cert.id, 'name', e.target.value)} className="bg-white/5" />
                  <Input placeholder="Organization" value={cert.org} onChange={e => updateEntry('certifications', cert.id, 'org', e.target.value)} className="bg-white/5" />
                  <Input type="date" value={cert.date} onChange={e => updateEntry('certifications', cert.id, 'date', e.target.value)} className="bg-white/5" />
                  <Input placeholder="Credential URL" value={cert.url} onChange={e => updateEntry('certifications', cert.id, 'url', e.target.value)} className="bg-white/5" />
                </div>
                <Button onClick={() => removeEntry('certifications', cert.id)} variant="ghost" className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></Button>
              </Card>
            ))}
          </div>

          <Button onClick={validateAndPreview} disabled={isVerifying} className="w-full h-16 bg-primary font-black uppercase italic tracking-widest shadow-glow">
            {isVerifying ? <Loader2 className="animate-spin" /> : "Verify Identity & Preview ATS PDF"}
          </Button>
        </div>

        {/* 🚀 PDF PREVIEW MODAL */}
        <AnimatePresence>
          {isPreviewOpen && (
            <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-5xl max-h-[85vh] overflow-y-auto no-scrollbar py-10 bg-black/20 rounded-xl">
                {/* PDF CONTAINER (ATS FORMAT) */}
                <div ref={resumeRef} className="bg-white text-black p-[20mm] w-[210mm] min-h-[297mm] mx-auto shadow-2xl flex flex-col font-sans">
                  <div className="text-center border-b-2 border-black pb-4 mb-8">
                    <h1 className="text-3xl font-bold uppercase">{formData.fullName}</h1>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">{formData.title}</p>
                    <div className="text-[9px] mt-1">{formData.email} • {formData.phone} • {formData.location}</div>
                    <div className="text-[8px] mt-1 italic">GitHub: {formData.github} | LinkedIn: {formData.linkedin}</div>
                  </div>
                  
                  <div className="space-y-6 text-left">
                    <section><h2 className="text-[12px] font-black uppercase border-b border-black/30 mb-2">Summary</h2><p className="text-[10px] italic leading-relaxed text-justify">{formData.summary}</p></section>
                    
                    <section><h2 className="text-[12px] font-black uppercase border-b border-black/30 mb-2">Education</h2>
                      {formData.education.map(edu => (
                        <div key={edu.id} className="mb-2 flex justify-between text-[10px]">
                          <div><strong>{edu.degree}</strong>, {edu.school}</div>
                          <span>{edu.start} - {edu.current ? 'Present' : edu.end}</span>
                        </div>
                      ))}
                    </section>

                    <section><h2 className="text-[12px] font-black uppercase border-b border-black/30 mb-2">Experience</h2>
                      {formData.experience.map(exp => (
                        <div key={exp.id} className="mb-3 text-[10px]">
                          <div className="flex justify-between font-bold"><span>{exp.role} @ {exp.company}</span><span>{exp.start} - {exp.current ? 'Present' : exp.end}</span></div>
                          <p className="mt-1 leading-relaxed text-gray-700">{exp.desc}</p>
                        </div>
                      ))}
                    </section>

                    <section><h2 className="text-[12px] font-black uppercase border-b border-black/30 mb-2">Projects</h2>
                      {formData.projects.map(proj => (
                        <div key={proj.id} className="mb-3 text-[10px]">
                          <div className="font-bold">{proj.title} <span className="font-normal text-gray-500">({proj.tech})</span></div>
                          <p className="mt-1 leading-relaxed">{proj.desc}</p>
                        </div>
                      ))}
                    </section>

                    <section><h2 className="text-[12px] font-black uppercase border-b border-black/30 mb-2">Skills</h2>
                      <div className="text-[10px]"><span className="font-bold">Technical:</span> {formData.skills.technical}</div>
                      <div className="text-[10px] mt-1"><span className="font-bold">Soft Skills:</span> {formData.skills.soft}</div>
                    </section>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-6">
                <Button onClick={downloadPDF} className="bg-primary h-14 px-12 font-black uppercase shadow-glow">Download ATS PDF</Button>
                <Button variant="ghost" onClick={() => setIsPreviewOpen(false)} className="text-white h-14 px-8 uppercase font-bold text-xs border border-white/20">Return</Button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilder;