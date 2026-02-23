import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  UserCircle,
  LogOut,
  Zap,
  ChevronLeft,
  Menu,
  X,
  Map,
  CircleAlertIcon, // 🚀 Added Map icon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/resume-builder", label: "Resume Builder", icon: FileText },
  { to: "/interview-prep", label: "Interview Prep", icon: MessageSquare },
  { to: "/roadmaps", label: "Roadmaps", icon: Map }, // 🚀 Added Roadmaps to Nav
  { to: "/profile", label: "Profile", icon: UserCircle },
  { to: "/certifications", label: "Certificates", icon: CircleAlertIcon  },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Mobile header */}
      {isMobile && (
        <header className="fixed top-0 inset-x-0 z-50 h-14 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="p-1.5">
              <Menu className="h-5 w-5 text-sidebar-foreground" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-sidebar-primary-foreground" />
              </div>
              {/* Updated Branding */}
              <span className="font-display font-bold text-sidebar-accent-foreground text-sm">SkillNect</span>
            </div>
          </div>
        </header>
      )}

      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
          isMobile
            ? cn("w-64", mobileOpen ? "translate-x-0" : "-translate-x-full")
            : collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            {(!collapsed || isMobile) && (
              <span className="font-display font-bold text-sidebar-accent-foreground truncate">
                SkillNect
              </span>
            )}
          </div>
          {isMobile && (
            <button onClick={() => setMobileOpen(false)} className="p-1.5">
              <X className="h-5 w-5 text-sidebar-foreground" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <RouterNavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {(!collapsed || isMobile) && <span>{item.label}</span>}
              </RouterNavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent w-full transition-colors"
            >
              <ChevronLeft className={cn("h-4 w-4 shrink-0 transition-transform", collapsed && "rotate-180")} />
              {!collapsed && <span>Collapse</span>}
            </button>
          )}
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive w-full transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {(!collapsed || isMobile) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          isMobile ? "mt-14" : collapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;