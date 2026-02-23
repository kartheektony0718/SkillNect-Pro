import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Globe,
  Palette,
  Layout,
  ExternalLink,
  Eye,
} from "lucide-react";

const templates = [
  { name: "Minimal Dark", description: "Clean, dark-themed portfolio", preview: "🌑" },
  { name: "Modern Light", description: "Bright, modern design", preview: "☀️" },
  { name: "Creative Bold", description: "Bold colors and layouts", preview: "🎨" },
  { name: "Developer Pro", description: "Technical, code-focused", preview: "💻" },
];

const PortfolioBuilder = () => {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">Portfolio Builder</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Create a stunning portfolio to showcase your work</p>
          </div>
          <Button variant="hero" className="w-full sm:w-auto">
            <Globe className="h-4 w-4" /> Deploy Portfolio
          </Button>
        </div>

        {/* Templates */}
        <div className="mb-8">
          <h2 className="text-lg font-display font-semibold mb-4">Choose a Template</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template, i) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300 overflow-hidden"
              >
                <div className="h-36 bg-secondary/50 flex items-center justify-center text-5xl">
                  {template.preview}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3" /> Preview
                    </Button>
                    <Button variant="default" size="sm" className="flex-1">
                      Use
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-display font-semibold mb-4">Portfolio Sections</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["About Me", "Skills", "Projects", "Certifications", "Experience", "Contact"].map((section) => (
              <div
                key={section}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border"
              >
                <div className="flex items-center gap-3">
                  <Layout className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{section}</span>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default PortfolioBuilder;
