import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Plus, Check, Trash2, X, ListChecks } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getConvertedGoals, clearConvertedGoals } from "@/lib/goalStore";
import { toast } from "sonner";

interface DailyTask {
  id: string;
  text: string;
  done: boolean;
  priority?: "high" | "medium" | "low";
}

interface Goal {
  id: string;
  title: string;
  category: string;
  steps: { text: string; done: boolean }[];
  emoji: string;
  fromVision?: boolean;
}

const computeProgress = (steps: { done: boolean }[]) =>
  steps.length === 0 ? 0 : Math.round((steps.filter((s) => s.done).length / steps.length) * 100);

const categoryColors: Record<string, string> = {
  Creativity: "gradient-sky", Travel: "gradient-warm", Health: "gradient-sage",
  Career: "gradient-hero", Relationships: "gradient-rose", Finance: "gradient-warm", Other: "gradient-hero",
};

const categoryEmojis: Record<string, string> = {
  Creativity: "🎨", Travel: "✈️", Health: "💪", Career: "💼",
  Relationships: "❤️", Finance: "💰", Other: "⭐",
};

const priorityColors = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-primary/10 text-primary border-primary/20",
  low: "bg-muted text-muted-foreground border-border",
};

const defaultGoals: Goal[] = [
  { id: "1", title: "Learn to play guitar", category: "Creativity", emoji: "🎸",
    steps: [{ text: "Buy a guitar", done: true }, { text: "Learn basic chords", done: true }, { text: "Practice 15 min daily for a month", done: false }, { text: "Learn a full song", done: false }] },
  { id: "2", title: "Travel to Japan", category: "Travel", emoji: "🗾",
    steps: [{ text: "Research destinations", done: true }, { text: "Set travel budget", done: false }, { text: "Book flights", done: false }, { text: "Plan itinerary", done: false }] },
  { id: "3", title: "Run a half marathon", category: "Health", emoji: "🏃",
    steps: [{ text: "Build running habit", done: true }, { text: "Run 10km comfortably", done: true }, { text: "Follow 12-week training plan", done: false }, { text: "Register for event", done: false }] },
];

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>(defaultGoals);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([
    { id: "t1", text: "Morning meditation", done: false, priority: "high" },
    { id: "t2", text: "Review weekly goals", done: false, priority: "medium" },
    { id: "t3", text: "Reply to emails", done: true, priority: "low" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Other");
  const [newSteps, setNewSteps] = useState<string[]>([""]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<DailyTask["priority"]>("medium");
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeTab, setActiveTab] = useState<"goals" | "daily">("goals");

  // Import goals from Vision Boards
  useEffect(() => {
    const importConverted = () => {
      const converted = getConvertedGoals();
      if (converted.length > 0) {
        const newGoals: Goal[] = converted.map((c) => ({
          id: c.id, title: c.title, emoji: c.emoji, fromVision: true,
          category: c.category in categoryEmojis ? c.category : "Other",
          steps: c.steps.map((text) => ({ text, done: false })),
        }));
        setGoals((prev) => [...newGoals, ...prev]);
        clearConvertedGoals();
        toast.success(`${converted.length} goal(s) imported from Vision Board!`);
      }
    };
    importConverted();
    window.addEventListener("goals-updated", importConverted);
    return () => window.removeEventListener("goals-updated", importConverted);
  }, []);

  const toggleStep = (goalId: string, stepIdx: number) => {
    setGoals((prev) => prev.map((g) =>
      g.id === goalId ? { ...g, steps: g.steps.map((s, i) => (i === stepIdx ? { ...s, done: !s.done } : s)) } : g
    ));
  };

  const deleteGoal = (goalId: string) => setGoals((prev) => prev.filter((g) => g.id !== goalId));

  const addGoal = () => {
    if (!newTitle.trim()) return;
    const validSteps = newSteps.filter((s) => s.trim());
    const goal: Goal = {
      id: Date.now().toString(), title: newTitle.trim(), category: newCategory,
      emoji: categoryEmojis[newCategory] || "⭐",
      steps: validSteps.map((text) => ({ text, done: false })),
    };
    setGoals((prev) => [goal, ...prev]);
    setNewTitle(""); setNewCategory("Other"); setNewSteps([""]); setShowAdd(false);
  };

  // Daily tasks
  const addDailyTask = () => {
    if (!newTaskText.trim()) return;
    setDailyTasks(prev => [{ id: Date.now().toString(), text: newTaskText, done: false, priority: newTaskPriority }, ...prev]);
    setNewTaskText(""); setShowAddTask(false);
  };

  const toggleTask = (id: string) => {
    setDailyTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: string) => {
    setDailyTasks(prev => prev.filter(t => t.id !== id));
  };

  const categories = Object.keys(categoryEmojis);
  const completedTasks = dailyTasks.filter(t => t.done).length;

  return (
    <AppLayout title="Life Goals">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Tab switcher */}
        <div className="flex gap-2 bg-muted/50 p-1 rounded-xl">
          <button onClick={() => setActiveTab("goals")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "goals" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>
            🎯 Life Goals
          </button>
          <button onClick={() => setActiveTab("daily")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "daily" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>
            📋 Daily Tasks <span className="ml-1 text-xs text-muted-foreground">({completedTasks}/{dailyTasks.length})</span>
          </button>
        </div>

        {activeTab === "daily" ? (
          <div className="space-y-4">
            {showAddTask ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-card border border-border shadow-card space-y-3">
                <Input placeholder="What do you need to do?" value={newTaskText} onChange={e => setNewTaskText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addDailyTask()} />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Priority:</span>
                  {(["high", "medium", "low"] as const).map(p => (
                    <button key={p} onClick={() => setNewTaskPriority(p)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                        newTaskPriority === p ? priorityColors[p] : "bg-muted/50 text-muted-foreground border-transparent"
                      }`}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addDailyTask} disabled={!newTaskText.trim()}>Add Task</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddTask(false)}>Cancel</Button>
                </div>
              </motion.div>
            ) : (
              <button onClick={() => setShowAddTask(true)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-all text-left group">
                <div className="w-8 h-8 rounded-lg gradient-warm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Add a daily task...</span>
              </button>
            )}

            <AnimatePresence>
              {dailyTasks.sort((a, b) => {
                const prio = { high: 0, medium: 1, low: 2 };
                if (a.done !== b.done) return a.done ? 1 : -1;
                return (prio[a.priority || "medium"] - prio[b.priority || "medium"]);
              }).map((task) => (
                <motion.div key={task.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border group">
                  <button onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      task.done ? "bg-accent border-accent" : "border-border"}`}>
                    {task.done && <Check className="w-3 h-3 text-accent-foreground" />}
                  </button>
                  <span className={`flex-1 text-sm ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.text}</span>
                  {task.priority && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  )}
                  <button onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10">
                    <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {dailyTasks.length > 0 && (
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div className="h-full rounded-full gradient-sage"
                  animate={{ width: `${(completedTasks / dailyTasks.length) * 100}%` }} />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={() => setShowAdd(true)}
              className="w-full flex items-center gap-3 p-5 rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-all text-left group">
              <div className="w-10 h-10 rounded-xl gradient-sage flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-medium text-muted-foreground">Add a new life goal or dream...</span>
            </motion.button>

            <AnimatePresence>
              {goals.map((goal, i) => {
                const progress = computeProgress(goal.steps);
                return (
                  <motion.div key={goal.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }} transition={{ delay: i * 0.05 }}
                    className="p-5 rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{goal.emoji}</span>
                        <div>
                          <h3 className="font-display text-lg font-bold text-foreground">{goal.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">{goal.category}</span>
                            {goal.fromVision && <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">From Vision Board</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">{progress}%</span>
                        <button onClick={() => deleteGoal(goal.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-4">
                      <motion.div className={`h-full rounded-full ${categoryColors[goal.category] || "gradient-hero"}`}
                        initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                    </div>
                    <div className="space-y-2">
                      {goal.steps.map((step, si) => (
                        <button key={si} onClick={() => toggleStep(goal.id, si)}
                          className="flex items-center gap-3 w-full text-left hover:bg-muted/50 rounded-lg px-2 py-1 transition-colors">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            step.done ? "bg-accent border-accent" : "border-border"}`}>
                            {step.done && <Check className="w-3 h-3 text-accent-foreground" />}
                          </div>
                          <span className={`text-sm ${step.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{step.text}</span>
                        </button>
                      ))}
                    </div>
                    {progress === 100 && <div className="mt-3 text-center text-sm font-semibold text-primary">🎉 Goal Complete!</div>}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Add a New Life Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="What's your dream or goal?" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setNewCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      newCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    {categoryEmojis[cat]} {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Steps</label>
              <div className="space-y-2">
                {newSteps.map((step, i) => (
                  <div key={i} className="flex gap-2">
                    <Input placeholder={`Step ${i + 1}`} value={step}
                      onChange={(e) => { const u = [...newSteps]; u[i] = e.target.value; setNewSteps(u); }} />
                    {newSteps.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => setNewSteps(newSteps.filter((_, j) => j !== i))}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setNewSteps([...newSteps, ""])}>
                  <Plus className="w-3 h-3 mr-1" /> Add Step
                </Button>
              </div>
            </div>
            <Button onClick={addGoal} className="w-full" disabled={!newTitle.trim()}>Create Goal</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Goals;
