import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ShieldAlert, Zap } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://skillrush-backend.onrender.com/api";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [creds, setCreds] = useState({ email: "", password: "", name: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isAdminMode ? 'auth/login' : (isLogin ? 'auth/login' : 'auth/register');
      // The fetch now uses the clean API_URL variable
      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: creds.email, password: creds.password, name: creds.name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Connection Failed");

      localStorage.setItem("user_role", data.user.role);
      login(data.user, data.token);
      toast.success(`Access Level: ${data.user.role.toUpperCase()}`);
      navigate(data.user.role === 'admin' ? "/admin" : "/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Cloud Connection Refused");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className={`w-full max-w-md p-10 bg-card rounded-[2.5rem] border shadow-glow ${isAdminMode ? 'border-primary' : 'border-white/5'}`}>
        <div className="text-center mb-8">
          <div className={`h-16 w-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${isAdminMode ? 'bg-primary shadow-glow' : 'bg-white/5'}`}>
            {isAdminMode ? <ShieldAlert className="text-white" /> : <Zap className="text-primary" />}
          </div>
          <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter">
            {isAdminMode ? "Admin Vault" : isLogin ? "Welcome" : "Register"}
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && !isAdminMode && (
            <Input placeholder="Full Name" value={creds.name} onChange={(e) => setCreds({...creds, name: e.target.value})} className="bg-white/5 border-white/10" />
          )}
          <Input placeholder={isAdminMode ? "Admin ID" : "Email"} value={creds.email} onChange={(e) => setCreds({...creds, email: e.target.value})} className="bg-white/5 border-white/10 uppercase font-bold" />
          <Input type="password" placeholder="Password" value={creds.password} onChange={(e) => setCreds({...creds, password: e.target.value})} className="bg-white/5 border-white/10" />
          <Button type="submit" className="w-full bg-primary h-14 font-black uppercase italic shadow-glow">Execute</Button>
        </form>
        <div className="mt-4 text-center">
           <button onClick={() => setIsLogin(!isLogin)} className="text-xs text-white/40 hover:text-white uppercase tracking-widest">
             {isLogin ? "Need an account? Register" : "Have an account? Login"}
           </button>
        </div>
        <button onClick={() => setIsAdminMode(!isAdminMode)} className="w-full mt-6 text-[10px] font-black uppercase text-primary tracking-widest animate-pulse">
          {isAdminMode ? "← Back to User Login" : "Enter Admin Portal"}
        </button>
      </div>
    </div>
  );
};

export default Auth;