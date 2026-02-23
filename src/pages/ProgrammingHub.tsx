import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Code2,
  ExternalLink,
  CheckCircle,
  Circle,
  Flame,
  Filter,
  BookOpen,
} from "lucide-react";
import { useState } from "react";

const languages = [
  { name: "Python", icon: "🐍", problems: 312, color: "from-yellow-400 to-yellow-600" },
  { name: "JavaScript", icon: "⚡", problems: 280, color: "from-yellow-300 to-amber-500" },
  { name: "Java", icon: "☕", problems: 245, color: "from-red-400 to-red-600" },
  { name: "C++", icon: "⚙️", problems: 198, color: "from-blue-400 to-blue-600" },
  { name: "SQL", icon: "🗃️", problems: 120, color: "from-cyan-400 to-cyan-600" },
  { name: "DSA", icon: "🧮", problems: 450, color: "from-purple-400 to-purple-600" },
];

const sampleProblems = [
  { title: "Two Sum", difficulty: "Easy", topic: "Arrays", solved: true },
  { title: "Add Two Numbers", difficulty: "Medium", topic: "Linked Lists", solved: false },
  { title: "Longest Substring", difficulty: "Medium", topic: "Strings", solved: false },
  { title: "Median of Two Arrays", difficulty: "Hard", topic: "Arrays", solved: false },
  { title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", solved: true },
  { title: "Merge Intervals", difficulty: "Medium", topic: "Arrays", solved: false },
];

const ProgrammingHub = () => {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const filteredProblems = sampleProblems.filter((p) => {
    if (filter === "all") return true;
    if (filter === "solved") return p.solved;
    return p.difficulty.toLowerCase() === filter;
  });

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">Programming Hub</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Master coding with structured roadmaps and practice</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold">0 day streak</span>
          </div>
        </div>

        {/* Languages Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {languages.map((lang, i) => (
            <motion.button
              key={lang.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedLang(lang.name)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                selectedLang === lang.name
                  ? "border-primary shadow-glow bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="text-2xl mb-2">{lang.icon}</div>
              <div className="font-semibold text-sm">{lang.name}</div>
              <div className="text-xs text-muted-foreground">{lang.problems} problems</div>
            </motion.button>
          ))}
        </div>

        {/* Problem List */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-display font-semibold flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {selectedLang ? `${selectedLang} Problems` : "All Problems"}
            </h2>
            <div className="flex items-center gap-2">
              {["all", "easy", "medium", "hard", "solved"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-border">
            {filteredProblems.map((problem, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  {problem.solved ? (
                    <CheckCircle className="h-4 w-4 text-accent" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <div className="font-medium text-sm">{problem.title}</div>
                    <div className="text-xs text-muted-foreground">{problem.topic}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      problem.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : problem.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ProgrammingHub;
