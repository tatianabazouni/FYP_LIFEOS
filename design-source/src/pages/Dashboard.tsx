import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { BookOpen, Target, Camera, Trophy, Flame, TrendingUp, Sparkles, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const xp = 245;
const level = 2;
const maxXp = 300;
const streak = 7;

const quickActions = [
  { icon: BookOpen, label: "Write Journal", path: "/journal", color: "gradient-warm" },
  { icon: Camera, label: "Daily Photo", path: "/daily-photo", color: "gradient-rose" },
  { icon: Target, label: "New Goal", path: "/goals", color: "gradient-sage" },
  { icon: Sparkles, label: "Ask AI", path: "/ai", color: "gradient-sky" },
];

const recentEntries = [
  { type: "Journal", title: "Grateful for small wins today", time: "2 hours ago", emoji: "📝" },
  { type: "Goal", title: "Learn to play guitar — Step 3 done!", time: "5 hours ago", emoji: "🎯" },
  { type: "Memory", title: "Sunset at the beach with friends", time: "Yesterday", emoji: "📸" },
  { type: "Badge", title: "7-Day Streak Unlocked!", time: "Yesterday", emoji: "🏆" },
];

const Dashboard = () => {
  return (
    <AppLayout title="Dashboard">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Good morning! ☀️</h2>
            <p className="text-muted-foreground mt-1">Let's make today count.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-card">
              <Flame className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">{streak} day streak</span>
            </div>
          </div>
        </motion.div>

        {/* XP Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-card border border-border shadow-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Level {level}</p>
                <p className="text-xs text-muted-foreground">{xp} / {maxXp} XP</p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">{Math.round((xp / maxXp) * 100)}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-hero"
              initial={{ width: 0 }}
              animate={{ width: `${(xp / maxXp) * 100}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <Link
                to={action.path}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-display text-xl font-bold mb-4 text-foreground">Recent Activity</h3>
          <div className="space-y-3">
            {recentEntries.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow"
              >
                <span className="text-2xl">{entry.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{entry.title}</p>
                  <p className="text-xs text-muted-foreground">{entry.type} · {entry.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
