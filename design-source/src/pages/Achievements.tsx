import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Trophy, Flame, Star, Medal, Lock } from "lucide-react";

const badges = [
  { name: "First Entry", desc: "Write your first journal entry", emoji: "✍️", unlocked: true },
  { name: "7-Day Streak", desc: "Journal 7 days in a row", emoji: "🔥", unlocked: true },
  { name: "Dream Setter", desc: "Create your first goal", emoji: "🎯", unlocked: true },
  { name: "Memory Maker", desc: "Add 10 memories to your capsule", emoji: "📸", unlocked: false },
  { name: "Visionary", desc: "Create 3 vision boards", emoji: "🖼️", unlocked: false },
  { name: "Goal Crusher", desc: "Complete your first goal", emoji: "💪", unlocked: false },
  { name: "Social Butterfly", desc: "Connect with 5 friends", emoji: "🦋", unlocked: false },
  { name: "30-Day Legend", desc: "Maintain a 30-day streak", emoji: "👑", unlocked: false },
];

const Achievements = () => {
  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <AppLayout title="Achievements">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Trophy, label: "Level", value: "2", color: "gradient-hero" },
            { icon: Flame, label: "Streak", value: "7 days", color: "gradient-warm" },
            { icon: Star, label: "Total XP", value: "245", color: "gradient-sky" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-card border border-border shadow-card text-center"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        <div>
          <h3 className="font-display text-xl font-bold mb-1 text-foreground">Badges</h3>
          <p className="text-sm text-muted-foreground mb-5">{unlockedCount} of {badges.length} unlocked</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {badges.map((badge, i) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`flex items-center gap-4 p-4 rounded-xl border shadow-card transition-all
                  ${badge.unlocked
                    ? "bg-card border-border"
                    : "bg-muted/30 border-border/50 opacity-60"
                  }`}
              >
                <span className="text-3xl">{badge.unlocked ? badge.emoji : "🔒"}</span>
                <div>
                  <p className="font-semibold text-foreground text-sm">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Achievements;
