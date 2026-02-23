import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, FileText, Calendar, MessageSquare, ChevronRight, Activity, X, TrendingUp, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ChatMessage = {
  id: string;
  role: 'interviewer' | 'candidate' | 'feedback';
  content: string;
};

type InterviewSession = {
  _id: string;
  jobDescription: string;
  messages: ChatMessage[];
  createdAt: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/interview/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const calculateAverageScore = (messages: ChatMessage[]) => {
    const feedbackMessages = messages.filter(m => m.role === 'feedback');
    if (feedbackMessages.length === 0) return 0;
    let totalScore = 0;
    let validScores = 0;
    feedbackMessages.forEach(msg => {
      const match = msg.content.match(/(\d+)\s*\/\s*10/); 
      if (match && match[1]) {
        totalScore += parseInt(match[1]);
        validScores++;
      }
    });
    return validScores > 0 ? Math.round(totalScore / validScores) : 0;
  };

  const chartData = [...history].reverse().map((session, index) => {
    return {
      name: `Int ${index + 1}`,
      date: new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: calculateAverageScore(session.messages)
    };
  }).filter(data => data.score > 0);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Welcome back!</h1>
        <p className="text-primary font-bold tracking-[0.2em] text-xs mt-1 uppercase">Mission Control Center</p>
      </div>

      {/* 🚀 QUICK ACTION CARDS */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {/* Mock Interview Card */}
        <Card className="hover:scale-[1.02] transition-all border-primary/20 bg-card/40 backdrop-blur-md">
          <CardHeader>
            <BrainCircuit className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-white font-bold tracking-tight">AI Mock Interview</CardTitle>
            <CardDescription className="text-muted-foreground text-xs">Practice based on your resume.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/interview-prep')} 
              className="w-full bg-primary hover:bg-primary/80 text-white font-black uppercase italic tracking-tighter shadow-[0_0_15px_rgba(210,4,45,0.3)]"
            >
              Start Practice
            </Button>
          </CardContent>
        </Card>

        {/* Resume Builder Card */}
        <Card className="hover:scale-[1.02] transition-all border-white/5 bg-card/40 backdrop-blur-md">
          <CardHeader>
            <FileText className="h-8 w-8 text-muted-foreground mb-2" />
            <CardTitle className="text-white font-bold tracking-tight">Resume Builder</CardTitle>
            <CardDescription className="text-muted-foreground text-xs">Create an ATS-friendly resume.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/resume-builder')} 
              variant="secondary" 
              className="w-full font-black uppercase italic tracking-tighter"
            >
              Edit Resume
            </Button>
          </CardContent>
        </Card>

        {/* 🚀 CHERRY PULSE ROADMAP CARD */}
        <Card className="hover:scale-[1.02] transition-all border-primary/30 bg-primary/5 backdrop-blur-md">
          <CardHeader>
            <Map className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-white font-bold tracking-tight">Career Roadmaps</CardTitle>
            <CardDescription className="text-muted-foreground text-xs">Follow step-by-step tech guides.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/roadmaps')} 
              className="w-full bg-primary hover:bg-primary/80 text-white font-black uppercase italic tracking-tighter shadow-[0_0_20px_rgba(210,4,45,0.4)] animate-cherry-pulse"
            >
              View Roadmaps
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 📊 Performance Analytics Chart */}
      {chartData.length > 0 && (
        <Card className="mb-8 border-primary/10 bg-card/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold italic uppercase tracking-tighter">Performance Growth</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.05} vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                  <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0A0B', borderColor: '#D2042D', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#D2042D' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#D2042D" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: "#D2042D", strokeWidth: 0 }} 
                    activeDot={{ r: 8, fill: "#D2042D", stroke: "#fff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Mission History</h2>
        </div>

        {loading ? (
          <div className="text-center p-8 animate-pulse text-muted-foreground uppercase tracking-widest text-xs">Syncing History...</div>
        ) : history.length === 0 ? (
          <Card className="border-dashed border-white/10 bg-transparent py-12 text-center text-muted-foreground">
             <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-10" />
             <p className="font-bold uppercase tracking-widest text-xs">No Data Logged</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {history.map((session) => (
              <Card 
                key={session._id} 
                className="hover:bg-primary/5 border-white/5 cursor-pointer group transition-all"
                onClick={() => setSelectedSession(session)}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-white line-clamp-1">{session.jobDescription.substring(0, 70)}...</p>
                    <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                      <span className="text-primary">Score: {calculateAverageScore(session.messages)}/10</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Transcript Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#0A0A0B] border border-primary/30 shadow-2xl rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between p-6 border-b border-white/5">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Transcript Log</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedSession(null)} className="hover:bg-primary/20"><X className="h-5 w-5" /></Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {selectedSession.messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'candidate' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl max-w-[80%] border ${msg.role === 'candidate' ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white/5 border-white/10 text-white'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-2">{msg.role}</span>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;