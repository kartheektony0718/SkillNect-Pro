import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Hook and Provider Imports
import { RequireAuth, AuthProvider, useAuth } from "@/hooks/useAuth"; 

// Component Imports
import { CustomCursor } from "@/components/CustomCursor"; 
import Certifications from "./pages/Certifications";
import Admin from "./pages/Admin";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import PortfolioBuilder from "./pages/PortfolioBuilder";
import ProgrammingHub from "./pages/ProgrammingHub";
import InterviewPrep from "./pages/InterviewPrep";
import Roadmaps from "./pages/Roadmaps";
import ExpertMatch from "./pages/ExpertMatch";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// 🛡️ ADMIN SECURITY GUARD
// Prevents standard users from accessing the /admin route manually
const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;

  const isAdminSession = localStorage.getItem("user_role") === "admin";
  const isMasterUser = user?.email === "skillrush" || user?.email === "kartheektony@gmail.com";
  
  if (!isAdminSession && !isMasterUser) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

// 🚀 Animated Wrapper to handle page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        {/* 🛡️ ADMIN MANAGEMENT PORTAL (Strictly Protected) */}
        <Route 
          path="/admin" 
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          } 
        />

        {/* PROTECTED CANDIDATE ROUTES (Requires basic Auth) */}
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/resume-builder" element={<RequireAuth><ResumeBuilder /></RequireAuth>} />
        <Route path="/portfolio" element={<RequireAuth><PortfolioBuilder /></RequireAuth>} />
        <Route path="/programming-hub" element={<RequireAuth><ProgrammingHub /></RequireAuth>} />
        <Route path="/interview-prep" element={<RequireAuth><InterviewPrep /></RequireAuth>} />
        <Route path="/roadmaps" element={<RequireAuth><Roadmaps /></RequireAuth>} /> 
        <Route path="/expert-match" element={<RequireAuth><ExpertMatch /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/certifications" element={<RequireAuth><Certifications /></RequireAuth>} />

        {/* 404 CATCH-ALL */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <CustomCursor /> {/* 🍒 The Cherry Glow Cursor */}
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;