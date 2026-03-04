import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  ShieldAlert, 
  LogOut, 
  User, 
  FileText, 
  Map, 
  BrainCircuit, 
  Zap 
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect role from localStorage or auth state
  const isAdmin = localStorage.getItem("user_role") === "admin";

  // Define links based on the user's role
  const links = isAdmin ? [
    { label: "Operations", icon: LayoutDashboard, path: "/admin" },
    { label: "Cloud Directory", icon: Users, path: "/admin" }, // Points back to the admin management table
  ] : [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "LMS Roadmaps", icon: Map, path: "/roadmaps" },
    { label: "Interviews", icon: BrainCircuit, path: "/interview-prep" },
    { label: "Resume Builder", icon: FileText, path: "/resume-builder" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      {/* --- Sidebar --- */}
      <aside className={`w-64 border-r hidden md:flex flex-col relative transition-all duration-300 ${
        isAdmin ? 'border-primary/20 bg-primary/5' : 'border-white/5 bg-card'
      }`}>
        <div className="p-8 flex-1">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
              isAdmin ? 'bg-primary shadow-glow' : 'bg-white/10'
            }`}>
               {isAdmin ? <ShieldAlert className="h-5 w-5 text-white" /> : <Zap className="h-5 w-5 text-primary" />}
            </div>
            <span className="font-black uppercase italic text-white tracking-tighter">
              {isAdmin ? "SkillRush OS" : "CareerForge AI"}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`flex items-center gap-3 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  location.pathname === link.path 
                    ? 'bg-primary text-white shadow-glow' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                }`}
              >
                <link.icon className="h-4 w-4" /> 
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* --- Bottom Logout Button --- */}
        <div className="p-8 border-t border-white/5">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 text-red-500 font-black uppercase text-[10px] tracking-widest hover:opacity-50 transition-opacity"
          >
            <LogOut className="h-4 w-4" /> 
            Terminate Session
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 overflow-y-auto bg-grid-pattern relative">
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Subtle background glow for Admin Mode */}
        {isAdmin && (
          <div className="absolute inset-0 bg-primary/5 pointer-events-none z-0" />
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;