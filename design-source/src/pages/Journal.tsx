import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Plus, Smile, Meh, Frown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Mood = "happy" | "neutral" | "sad";

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: Mood;
  tags: string[];
}

const moodIcons = { happy: Smile, neutral: Meh, sad: Frown };
const moodColors = { happy: "text-accent", neutral: "text-gold", sad: "text-rose" };

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    { id: "1", date: "Today", content: "Had a great morning run. Feeling energized and ready to tackle my goals. The sunrise was beautiful — reminded me why I love early mornings.", mood: "happy", tags: ["gratitude", "health"] },
    { id: "2", date: "Yesterday", content: "Tough day at work but managed to stay calm. Practiced breathing exercises during lunch. Small wins matter.", mood: "neutral", tags: ["work", "mindfulness"] },
    { id: "3", date: "Feb 11", content: "Deep conversation with an old friend about life direction. It's comforting to know I'm not alone in figuring things out.", mood: "happy", tags: ["friendship", "reflection"] },
  ]);
  const [showNew, setShowNew] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newMood, setNewMood] = useState<Mood>("neutral");
  const [newTags, setNewTags] = useState("");

  const saveEntry = () => {
    if (!newContent.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      content: newContent,
      mood: newMood,
      tags: newTags.split(",").map(t => t.trim()).filter(Boolean),
    };
    setEntries([entry, ...entries]);
    setNewContent("");
    setNewMood("neutral");
    setNewTags("");
    setShowNew(false);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <AppLayout title="Journal">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* New Entry */}
        <motion.button
          onClick={() => setShowNew(!showNew)}
          className="w-full flex items-center gap-3 p-5 rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-all text-left group"
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-medium text-muted-foreground">How are you feeling today?</span>
        </motion.button>

        <AnimatePresence>
          {showNew && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 rounded-2xl bg-card border border-border shadow-card space-y-4">
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write your thoughts..."
                  className="w-full min-h-[120px] bg-transparent resize-none text-foreground placeholder:text-muted-foreground focus:outline-none font-body"
                />
                <input
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Tags (comma-separated: gratitude, health, work)"
                  className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {(["happy", "neutral", "sad"] as Mood[]).map((m) => {
                      const Icon = moodIcons[m];
                      return (
                        <button
                          key={m}
                          onClick={() => setNewMood(m)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all
                            ${newMood === m ? "bg-primary/10 scale-110" : "hover:bg-muted"}`}
                        >
                          <Icon className={`w-5 h-5 ${newMood === m ? moodColors[m] : "text-muted-foreground"}`} />
                        </button>
                      );
                    })}
                  </div>
                  <Button size="sm" onClick={saveEntry} disabled={!newContent.trim()}>
                    Save Entry
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entries */}
        <div className="space-y-4">
          {entries.map((entry, i) => {
            const MoodIcon = moodIcons[entry.mood];
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl bg-card border border-border shadow-card group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">{entry.date}</span>
                  <div className="flex items-center gap-2">
                    <MoodIcon className={`w-5 h-5 ${moodColors[entry.mood]}`} />
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>
                <p className="text-foreground leading-relaxed mb-3">{entry.content}</p>
                <div className="flex gap-2">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Journal;
