import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Certifications from "./pages/Certifications";
import { RequireAuth, AuthProvider } from "@/hooks/useAuth"; 
import { CustomCursor } from "@/components/CustomCursor"; // 🚀 We will create this next

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

// 🚀 Animated Wrapper to handle page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/resume-builder" element={<RequireAuth><ResumeBuilder /></RequireAuth>} />
        <Route path="/portfolio" element={<RequireAuth><PortfolioBuilder /></RequireAuth>} />
        <Route path="/programming-hub" element={<RequireAuth><ProgrammingHub /></RequireAuth>} />
        <Route path="/interview-prep" element={<RequireAuth><InterviewPrep /></RequireAuth>} />
        <Route path="/roadmaps" element={<RequireAuth><Roadmaps /></RequireAuth>} /> 
        <Route path="/expert-match" element={<RequireAuth><ExpertMatch /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/certifications" element={<RequireAuth><Certifications /></RequireAuth>} />
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