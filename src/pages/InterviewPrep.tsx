import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Play, Send, FileText, Briefcase, BrainCircuit, Mic, MicOff, Volume2, VolumeX, Save } from "lucide-react";

type ChatMessage = {
  id: string;
  role: 'interviewer' | 'candidate' | 'feedback';
  content: string;
};

const InterviewPrep = () => {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [answer, setAnswer] = useState("");
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window) || isMuted) return;
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; 
    window.speechSynthesis.speak(utterance);
  };

  const handleStart = async () => {
    if (!resumeFile && !resumeText.trim()) return toast.error("Please upload or paste your resume.");
    if (!jobDescription.trim()) return toast.error("Please paste the job description.");

    const formData = new FormData();
    if (resumeFile) formData.append("resume", resumeFile);
    if (resumeText) formData.append("resumeText", resumeText);
    formData.append("jobDescription", jobDescription);

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/interview/start', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData 
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessages([{ id: Date.now().toString(), role: 'interviewer', content: data.question }]);
        speakText(data.question);
        setStarted(true);
      } else {
        toast.error(data.error || "Failed to start.");
      }
    } catch (error) {
      toast.error("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return toast.error("Please provide an answer.");
    
    const currentQuestion = messages.filter(m => m.role === 'interviewer').pop()?.content || "";
    const candidateAnswer = answer;
    
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'candidate', content: candidateAnswer }]);
    setAnswer("");
    setLoading(true);
    if (isRecording) toggleRecording();

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/interview/feedback', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ question: currentQuestion, answer: candidateAnswer, jobDescription })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        const nextQ = data.nextQuestion || "Let's move on. " + data.question;
        
        setMessages(prev => [
          ...prev, 
          { id: (Date.now() + 1).toString(), role: 'feedback', content: data.feedback },
          { id: (Date.now() + 2).toString(), role: 'interviewer', content: nextQ }
        ]);
        
        speakText(nextQ);
      } else {
         toast.error(data.error || "Failed to submit.");
      }
    } catch (error) {
      toast.error("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  // 🚀 NEW: The actual save function
  const handleEndInterview = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/interview/save', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ jobDescription, messages }) 
      });

      if (res.ok) {
        toast.success("Interview saved to your profile!");
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        toast.error("Failed to save interview.");
      }
    } catch (error) {
      toast.error("Network error while saving.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return toast.error("Browser not supported. Try Chrome.");

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsRecording(true);

    let currentAnswer = answer;
    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript + " ";
        else interimTranscript += event.results[i][0].transcript;
      }
      setAnswer(currentAnswer + finalTranscript + interimTranscript);
      if (finalTranscript) currentAnswer += finalTranscript;
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI Interview Coach</h1>
          <p className="text-muted-foreground">Tailored practice based on your specific resume.</p>
        </div>
        {started && (
          <Button variant="destructive" onClick={handleEndInterview} disabled={loading} className="gap-2">
            <Save className="h-4 w-4" /> {loading ? "Saving..." : "End & Save Results"}
          </Button>
        )}
      </div>

      {!started ? (
        <div className="max-w-3xl mx-auto space-y-6 bg-card border p-8 rounded-2xl shadow-sm">
          <div className="space-y-4">
            <div className="p-6 border-2 border-dashed rounded-xl flex flex-col items-center gap-2 hover:bg-secondary/5 transition-colors">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <Label htmlFor="resume-upload" className="cursor-pointer font-semibold text-primary">
                {resumeFile ? resumeFile.name : "Upload Resume (PDF)"}
              </Label>
              <Input id="resume-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => { setResumeFile(e.target.files?.[0] || null); setResumeText(""); }} />
            </div>
            <div className="text-center text-sm text-muted-foreground font-bold">— OR —</div>
            <div className="space-y-2">
              <Label>Paste Resume Text</Label>
              <Textarea placeholder="Paste your resume content here..." className="min-h-[100px]" value={resumeText} onChange={(e) => { setResumeText(e.target.value); setResumeFile(null); }} />
            </div>
            <div className="space-y-2 mt-6">
              <Label><Briefcase className="h-4 w-4 inline mr-2"/> Target Job Description</Label>
              <Textarea placeholder="Paste the job requirements here..." className="min-h-[120px]" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
            </div>
            <Button className="w-full h-12 text-lg mt-4" onClick={handleStart} disabled={loading}>
              {loading ? "Analyzing Context..." : "Begin Mock Interview"} <Play className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-[70vh] max-h-[800px] border rounded-2xl bg-card overflow-hidden shadow-sm">
          
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-secondary/5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'candidate' ? 'justify-end' : 'justify-start'}`}>
                
                {msg.role === 'interviewer' && (
                  <div className="max-w-[80%] bg-primary/10 border border-primary/20 text-foreground p-4 rounded-2xl rounded-tl-sm shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-widest block mb-2">Interviewer</span>
                    <p className="text-lg leading-relaxed">{msg.content}</p>
                  </div>
                )}

                {msg.role === 'candidate' && (
                  <div className="max-w-[80%] bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-sm shadow-sm">
                     <span className="text-[10px] uppercase font-bold text-primary-foreground/70 tracking-widest block mb-2">You</span>
                    <p className="text-lg leading-relaxed">{msg.content}</p>
                  </div>
                )}

                {msg.role === 'feedback' && (
                  <div className="w-full flex justify-center my-4">
                    <div className="max-w-[90%] bg-card border-2 border-secondary p-5 rounded-xl shadow-sm relative">
                      <BrainCircuit className="absolute -top-3 -left-3 h-8 w-8 text-secondary bg-background rounded-full p-1 border" />
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest block mb-2 ml-4">AI Analysis & Score</span>
                      <p className="text-sm whitespace-pre-line text-muted-foreground">{msg.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
               <div className="flex justify-start">
                  <div className="bg-primary/5 border p-4 rounded-2xl rounded-tl-sm animate-pulse text-muted-foreground">
                    Groq AI is typing...
                  </div>
               </div>
            )}
          </div>

          <div className="p-4 bg-background border-t">
            <div className="flex justify-between items-center mb-2 px-2">
               <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Your Answer</Label>
               <div className="flex gap-2">
                 <button onClick={() => { setIsMuted(!isMuted); if(!isMuted) window.speechSynthesis.cancel(); }} className="text-muted-foreground hover:text-primary transition-colors">
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                 </button>
               </div>
            </div>
            <div className="flex gap-3">
              <Button variant={isRecording ? "destructive" : "outline"} className={`w-14 h-14 shrink-0 ${isRecording ? 'animate-pulse' : ''}`} onClick={toggleRecording}>
                {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>
              <Textarea 
                placeholder="Type your answer, or click the mic to speak..." 
                className="min-h-[56px] h-14 resize-none shadow-inner text-base py-3"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitAnswer(); } }}
              />
              <Button className="w-24 h-14 shrink-0" onClick={handleSubmitAnswer} disabled={loading || !answer.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default InterviewPrep;