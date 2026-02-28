import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Plus, ChevronDown, Trash2, Edit2, X, Star, Heart, Calendar, MapPin, Users, Baby, GraduationCap, Church, Cake, Briefcase, Plane, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";

interface Memory {
  id: string;
  text: string;
  type: "text" | "milestone" | "photo-moment" | "lesson";
  emoji: string;
  date: string;
  location?: string;
  people?: string;
  feeling?: string;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  dateRange: string;
  category: string;
  memories: Memory[];
}

const emotionEmojis = ["😊", "🥲", "🥳", "💪", "🌟", "❤️", "🙏", "🔥", "🌈", "✨", "😢", "🤗", "😌", "🫶", "🥰"];

const chapterColors = ["gradient-hero", "gradient-warm", "gradient-sage", "gradient-rose", "gradient-sky"];

const memoryTypes = [
  { value: "text" as const, label: "Memory", icon: "💭" },
  { value: "milestone" as const, label: "Milestone", icon: "⭐" },
  { value: "photo-moment" as const, label: "Photo Moment", icon: "📸" },
  { value: "lesson" as const, label: "Life Lesson", icon: "📖" },
];

const feelingOptions = ["Happy", "Grateful", "Proud", "Nostalgic", "Bittersweet", "Excited", "Peaceful", "Emotional"];

// Life stage templates for quick chapter creation
const lifeStageTemplates = [
  { title: "Childhood", emoji: "👶", category: "childhood", color: "gradient-warm", description: "The early years that shaped everything", icon: Baby, dateHint: "Birth – age 5" },
  { title: "Primary School", emoji: "📚", category: "school", color: "gradient-sky", description: "First friends, first lessons, first adventures", icon: GraduationCap, dateHint: "Age 5 – 12" },
  { title: "Baptism / Christening", emoji: "⛪", category: "religious", color: "gradient-sage", description: "A sacred beginning", icon: Church, dateHint: "" },
  { title: "First Holy Communion", emoji: "🕊️", category: "religious", color: "gradient-hero", description: "A spiritual milestone", icon: Church, dateHint: "" },
  { title: "Confirmation", emoji: "✝️", category: "religious", color: "gradient-rose", description: "Affirming faith and identity", icon: Church, dateHint: "" },
  { title: "Birthday Memories", emoji: "🎂", category: "celebrations", color: "gradient-warm", description: "Cakes, candles, and growing up", icon: Cake, dateHint: "Every year" },
  { title: "Secondary School", emoji: "🎒", category: "school", color: "gradient-sky", description: "Growing up, finding identity", icon: GraduationCap, dateHint: "Age 12 – 18" },
  { title: "University / College", emoji: "🎓", category: "education", color: "gradient-hero", description: "The chapter that shaped who I am", icon: GraduationCap, dateHint: "" },
  { title: "First Job", emoji: "💼", category: "career", color: "gradient-sage", description: "Stepping into the real world", icon: Briefcase, dateHint: "" },
  { title: "Travelling", emoji: "✈️", category: "travel", color: "gradient-warm", description: "Seeing the world and finding perspective", icon: Plane, dateHint: "" },
  { title: "Moving Out", emoji: "🏡", category: "home", color: "gradient-rose", description: "Building my own space", icon: Home, dateHint: "" },
  { title: "Finding My Passion", emoji: "🔥", category: "growth", color: "gradient-hero", description: "When I discovered what truly drives me", icon: Sparkles, dateHint: "" },
  { title: "Relationship", emoji: "❤️", category: "love", color: "gradient-rose", description: "Love, connection, and growth together", icon: Heart, dateHint: "" },
  { title: "Family Moments", emoji: "👨‍👩‍👧‍👦", category: "family", color: "gradient-warm", description: "The people who mean everything", icon: Users, dateHint: "" },
];

const defaultChapters: Chapter[] = [
  {
    id: "1", title: "Childhood", description: "The early years that shaped everything",
    emoji: "👶", color: "gradient-warm", dateRange: "1998 – 2004", category: "childhood",
    memories: [
      { id: "m1", text: "My earliest memory — playing in the garden with my siblings", type: "text", emoji: "🌈", date: "~2000", feeling: "Nostalgic" },
      { id: "m2", text: "First day of school — I cried but made a friend by lunchtime", type: "milestone", emoji: "😊", date: "Sep 2003", feeling: "Bittersweet" },
    ],
  },
  {
    id: "2", title: "Baptism", description: "A sacred beginning",
    emoji: "⛪", color: "gradient-sage", dateRange: "1999", category: "religious",
    memories: [
      { id: "m3", text: "Baptised at St. Mary's — wearing the family christening gown", type: "milestone", emoji: "🕊️", date: "Mar 1999", people: "Family", feeling: "Peaceful" },
    ],
  },
  {
    id: "3", title: "Birthday Memories", description: "Cakes, candles, and growing up",
    emoji: "🎂", color: "gradient-warm", dateRange: "Every year", category: "celebrations",
    memories: [
      { id: "m4", text: "5th birthday — superhero party in the back garden!", type: "text", emoji: "🥳", date: "2003", feeling: "Happy" },
      { id: "m5", text: "18th birthday — surprise party I'll never forget", type: "milestone", emoji: "🎉", date: "2016", people: "Friends & Family", feeling: "Grateful" },
    ],
  },
  {
    id: "4", title: "University Years", description: "The chapter that shaped who I am today",
    emoji: "🎓", color: "gradient-sky", dateRange: "2022 – 2026", category: "education",
    memories: [
      { id: "m6", text: "First day on campus — nervous but excited!", type: "text", emoji: "😊", date: "Sep 2022", location: "Campus", feeling: "Excited" },
      { id: "m7", text: "Passed my first programming exam", type: "milestone", emoji: "🥳", date: "Jan 2023", feeling: "Proud" },
      { id: "m8", text: "Late night coding sessions with friends", type: "text", emoji: "🔥", date: "Mar 2023", people: "Study group", feeling: "Happy" },
      { id: "m9", text: "Started LifeOS as my final year project", type: "milestone", emoji: "🌟", date: "Oct 2025", feeling: "Excited" },
    ],
  },
];

const LifeCapsule = () => {
  const [chapters, setChapters] = useState<Chapter[]>(defaultChapters);
  const [expandedChapter, setExpandedChapter] = useState<string | null>("4");
  const [showNewChapter, setShowNewChapter] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showNewMemory, setShowNewMemory] = useState<string | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  // New chapter form
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterDesc, setNewChapterDesc] = useState("");
  const [newChapterEmoji, setNewChapterEmoji] = useState("✨");
  const [newChapterColor, setNewChapterColor] = useState("gradient-hero");
  const [newChapterDateRange, setNewChapterDateRange] = useState("");

  // New memory form
  const [newMemoryText, setNewMemoryText] = useState("");
  const [newMemoryEmoji, setNewMemoryEmoji] = useState("😊");
  const [newMemoryType, setNewMemoryType] = useState<Memory["type"]>("text");
  const [newMemoryDate, setNewMemoryDate] = useState("");
  const [newMemoryLocation, setNewMemoryLocation] = useState("");
  const [newMemoryPeople, setNewMemoryPeople] = useState("");
  const [newMemoryFeeling, setNewMemoryFeeling] = useState("");

  const addChapterFromTemplate = (template: typeof lifeStageTemplates[0]) => {
    const chapter: Chapter = {
      id: Date.now().toString(),
      title: template.title,
      description: template.description,
      emoji: template.emoji,
      color: template.color,
      dateRange: template.dateHint || new Date().getFullYear().toString(),
      category: template.category,
      memories: [],
    };
    setChapters([...chapters, chapter]);
    setShowTemplates(false);
    setExpandedChapter(chapter.id);
  };

  const addChapter = () => {
    if (!newChapterTitle.trim()) return;
    const chapter: Chapter = {
      id: Date.now().toString(),
      title: newChapterTitle,
      description: newChapterDesc,
      emoji: newChapterEmoji,
      color: newChapterColor,
      dateRange: newChapterDateRange || new Date().getFullYear().toString() + " – Present",
      category: "custom",
      memories: [],
    };
    setChapters([...chapters, chapter]);
    resetChapterForm();
    setExpandedChapter(chapter.id);
  };

  const resetChapterForm = () => {
    setNewChapterTitle("");
    setNewChapterDesc("");
    setNewChapterEmoji("✨");
    setNewChapterColor("gradient-hero");
    setNewChapterDateRange("");
    setShowNewChapter(false);
  };

  const addMemory = (chapterId: string) => {
    if (!newMemoryText.trim()) return;
    const memory: Memory = {
      id: Date.now().toString(),
      text: newMemoryText,
      type: newMemoryType,
      emoji: newMemoryEmoji,
      date: newMemoryDate || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      location: newMemoryLocation || undefined,
      people: newMemoryPeople || undefined,
      feeling: newMemoryFeeling || undefined,
    };
    setChapters(chapters.map(c =>
      c.id === chapterId ? { ...c, memories: [...c.memories, memory] } : c
    ));
    resetMemoryForm();
  };

  const resetMemoryForm = () => {
    setNewMemoryText("");
    setNewMemoryEmoji("😊");
    setNewMemoryType("text");
    setNewMemoryDate("");
    setNewMemoryLocation("");
    setNewMemoryPeople("");
    setNewMemoryFeeling("");
    setShowNewMemory(null);
  };

  const deleteMemory = (chapterId: string, memoryId: string) => {
    setChapters(chapters.map(c =>
      c.id === chapterId ? { ...c, memories: c.memories.filter(m => m.id !== memoryId) } : c
    ));
  };

  const deleteChapter = (chapterId: string) => {
    setChapters(chapters.filter(c => c.id !== chapterId));
    if (expandedChapter === chapterId) setExpandedChapter(null);
  };

  const saveEditChapter = () => {
    if (!editingChapter) return;
    setChapters(chapters.map(c => c.id === editingChapter.id ? editingChapter : c));
    setEditingChapter(null);
  };

  const totalMemories = chapters.reduce((sum, c) => sum + c.memories.length, 0);
  const totalMilestones = chapters.reduce((sum, c) => sum + c.memories.filter(m => m.type === "milestone").length, 0);

  return (
    <AppLayout title="Life Capsule">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header with stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <h2 className="font-display text-2xl font-bold text-foreground">Your Life Story</h2>
          <p className="text-sm text-muted-foreground">Create chapters and capture memories that matter</p>
          <div className="flex justify-center gap-6 pt-1">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{chapters.length}</p>
              <p className="text-xs text-muted-foreground">Chapters</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalMemories}</p>
              <p className="text-xs text-muted-foreground">Memories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalMilestones}</p>
              <p className="text-xs text-muted-foreground">Milestones</p>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {chapters.map((chapter, i) => {
              const isExpanded = expandedChapter === chapter.id;
              const milestoneCount = chapter.memories.filter(m => m.type === "milestone").length;
              return (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative pl-14"
                >
                  <div className={`absolute left-4 top-4 w-5 h-5 rounded-full ${chapter.color} border-2 border-background shadow-soft z-10`} />

                  <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
                    <button
                      onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                      className="w-full p-5 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-2xl">{chapter.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg font-bold text-foreground">{chapter.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {chapter.dateRange} · {chapter.memories.length} memories
                          {milestoneCount > 0 && ` · ${milestoneCount} milestones`}
                        </p>
                      </div>
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          {chapter.description && (
                            <p className="px-5 pb-3 text-sm text-muted-foreground italic">"{chapter.description}"</p>
                          )}

                          <div className="px-5 pb-3 flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setEditingChapter({ ...chapter })}>
                              <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteChapter(chapter.id)}>
                              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                            </Button>
                          </div>

                          {/* Memories */}
                          <div className="px-5 pb-4 space-y-3">
                            {chapter.memories.length === 0 && (
                              <p className="text-sm text-muted-foreground text-center py-4 italic">No memories yet. Start documenting this chapter of your life!</p>
                            )}
                            {chapter.memories.map((memory, mi) => (
                              <motion.div
                                key={memory.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: mi * 0.04 }}
                                className={`p-3 rounded-xl group ${
                                  memory.type === "milestone" ? "bg-primary/5 border border-primary/10" :
                                  memory.type === "lesson" ? "bg-accent/5 border border-accent/10" :
                                  memory.type === "photo-moment" ? "bg-muted/60 border border-border" :
                                  "bg-muted/40"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <span className="text-lg mt-0.5">{memory.emoji}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-foreground">{memory.text}</p>
                                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {memory.date}
                                      </span>
                                      {memory.location && (
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                          <MapPin className="w-3 h-3" /> {memory.location}
                                        </span>
                                      )}
                                      {memory.people && (
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                          <Users className="w-3 h-3" /> {memory.people}
                                        </span>
                                      )}
                                      {memory.feeling && (
                                        <span className="text-xs font-medium text-primary/80 bg-primary/5 px-1.5 py-0.5 rounded-full">{memory.feeling}</span>
                                      )}
                                    </div>
                                    {memory.type === "milestone" && (
                                      <span className="inline-block mt-1.5 text-xs font-medium text-primary">✦ Milestone</span>
                                    )}
                                    {memory.type === "lesson" && (
                                      <span className="inline-block mt-1.5 text-xs font-medium text-accent">📖 Life Lesson</span>
                                    )}
                                    {memory.type === "photo-moment" && (
                                      <span className="inline-block mt-1.5 text-xs font-medium text-muted-foreground">📸 Photo Moment</span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => deleteMemory(chapter.id, memory.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
                                  >
                                    <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                                  </button>
                                </div>
                              </motion.div>
                            ))}

                            {/* Add memory form */}
                            {showNewMemory === chapter.id ? (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border">
                                <Textarea
                                  placeholder="What happened? How did it feel? Describe this memory..."
                                  value={newMemoryText}
                                  onChange={(e) => setNewMemoryText(e.target.value)}
                                  className="min-h-[80px]"
                                />

                                {/* Memory type */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs text-muted-foreground font-medium">Type:</span>
                                  {memoryTypes.map(mt => (
                                    <button
                                      key={mt.value}
                                      onClick={() => setNewMemoryType(mt.value)}
                                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                        newMemoryType === mt.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                                      }`}
                                    >
                                      {mt.icon} {mt.label}
                                    </button>
                                  ))}
                                </div>

                                {/* Emotion picker */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs text-muted-foreground font-medium mr-1">Emotion:</span>
                                  {emotionEmojis.map(em => (
                                    <button
                                      key={em}
                                      onClick={() => setNewMemoryEmoji(em)}
                                      className={`text-lg p-0.5 rounded-lg transition-all ${newMemoryEmoji === em ? "bg-primary/10 scale-110" : "hover:bg-muted"}`}
                                    >{em}</button>
                                  ))}
                                </div>

                                {/* Feeling */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs text-muted-foreground font-medium mr-1">Feeling:</span>
                                  {feelingOptions.map(f => (
                                    <button
                                      key={f}
                                      onClick={() => setNewMemoryFeeling(newMemoryFeeling === f ? "" : f)}
                                      className={`px-2 py-0.5 rounded-full text-xs transition-all ${
                                        newMemoryFeeling === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                                      }`}
                                    >{f}</button>
                                  ))}
                                </div>

                                {/* Details row */}
                                <div className="grid grid-cols-3 gap-2">
                                  <Input placeholder="When? (e.g. Jun 2015)" value={newMemoryDate} onChange={e => setNewMemoryDate(e.target.value)} className="text-xs" />
                                  <Input placeholder="Where?" value={newMemoryLocation} onChange={e => setNewMemoryLocation(e.target.value)} className="text-xs" />
                                  <Input placeholder="Who was there?" value={newMemoryPeople} onChange={e => setNewMemoryPeople(e.target.value)} className="text-xs" />
                                </div>

                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => addMemory(chapter.id)} disabled={!newMemoryText.trim()}>Save Memory</Button>
                                  <Button size="sm" variant="ghost" onClick={resetMemoryForm}>Cancel</Button>
                                </div>
                              </motion.div>
                            ) : (
                              <button
                                onClick={() => setShowNewMemory(chapter.id)}
                                className="w-full flex items-center gap-2 p-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                              >
                                <Plus className="w-4 h-4" /> Add a memory to this chapter
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}

            {/* New chapter section */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative pl-14">
              <div className="absolute left-4 top-4 w-5 h-5 rounded-full bg-muted border-2 border-background z-10 flex items-center justify-center">
                <Plus className="w-3 h-3 text-muted-foreground" />
              </div>

              {showNewChapter ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card border border-border shadow-card p-5 space-y-4">
                  <h4 className="font-display font-bold text-foreground">New Life Chapter</h4>
                  <Input placeholder="Chapter title (e.g., 'Moving Abroad')" value={newChapterTitle} onChange={e => setNewChapterTitle(e.target.value)} />
                  <Textarea placeholder="What does this chapter mean to you?" value={newChapterDesc} onChange={e => setNewChapterDesc(e.target.value)} className="min-h-[60px]" />
                  <Input placeholder="Date range (e.g., 2020 – 2023)" value={newChapterDateRange} onChange={e => setNewChapterDateRange(e.target.value)} />

                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">Choose an icon:</span>
                    <div className="flex gap-2 flex-wrap">
                      {["✨", "🎓", "🔥", "🌍", "❤️", "🏡", "💼", "🎨", "🌱", "🎯", "⛪", "🎂", "👶", "✈️", "📚"].map(em => (
                        <button key={em} onClick={() => setNewChapterEmoji(em)}
                          className={`text-xl p-1.5 rounded-lg transition-all ${newChapterEmoji === em ? "bg-primary/10 scale-110 ring-2 ring-primary/30" : "hover:bg-muted"}`}
                        >{em}</button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">Color:</span>
                    <div className="flex gap-2">
                      {chapterColors.map(c => (
                        <button key={c} onClick={() => setNewChapterColor(c)}
                          className={`w-8 h-8 rounded-full ${c} transition-transform ${newChapterColor === c ? "scale-110 ring-2 ring-offset-2 ring-primary" : ""}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={addChapter} disabled={!newChapterTitle.trim()}>Create Chapter</Button>
                    <Button variant="ghost" onClick={resetChapterForm}>Cancel</Button>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowNewChapter(true)}
                      className="flex-1 p-5 rounded-2xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      ✍️ Write a custom chapter...
                    </button>
                    <button
                      onClick={() => setShowTemplates(true)}
                      className="flex-1 p-5 rounded-2xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      📋 Use a life stage template...
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Life Stage Templates Dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Choose a Life Stage</DialogTitle>
            <DialogDescription>Select a template to start a new chapter from a common life stage</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            {lifeStageTemplates.map((template) => {
              const existing = chapters.some(c => c.title === template.title);
              return (
                <button
                  key={template.title}
                  onClick={() => !existing && addChapterFromTemplate(template)}
                  disabled={existing}
                  className={`p-4 rounded-xl text-left transition-all ${
                    existing
                      ? "bg-muted/30 opacity-50 cursor-not-allowed"
                      : "bg-card border border-border hover:border-primary/40 hover:shadow-card"
                  }`}
                >
                  <span className="text-2xl block mb-1">{template.emoji}</span>
                  <p className="font-medium text-sm text-foreground">{template.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                  {existing && <p className="text-xs text-primary mt-1">Already added</p>}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Chapter Dialog */}
      <Dialog open={!!editingChapter} onOpenChange={(open) => !open && setEditingChapter(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Chapter</DialogTitle>
            <DialogDescription>Update this chapter's details</DialogDescription>
          </DialogHeader>
          {editingChapter && (
            <div className="space-y-4">
              <Input value={editingChapter.title} onChange={e => setEditingChapter({ ...editingChapter, title: e.target.value })} placeholder="Chapter title" />
              <Textarea value={editingChapter.description} onChange={e => setEditingChapter({ ...editingChapter, description: e.target.value })} placeholder="Chapter description" />
              <Input value={editingChapter.dateRange} onChange={e => setEditingChapter({ ...editingChapter, dateRange: e.target.value })} placeholder="Date range" />
              <div className="flex gap-2 flex-wrap">
                {["✨", "🎓", "🔥", "🌍", "❤️", "🏡", "💼", "🎨", "🌱", "🎯", "⛪", "🎂", "👶", "✈️", "📚"].map(em => (
                  <button key={em} onClick={() => setEditingChapter({ ...editingChapter, emoji: em })}
                    className={`text-xl p-1.5 rounded-lg transition-all ${editingChapter.emoji === em ? "bg-primary/10 scale-110" : "hover:bg-muted"}`}
                  >{em}</button>
                ))}
              </div>
              <div className="flex gap-2">
                {chapterColors.map(c => (
                  <button key={c} onClick={() => setEditingChapter({ ...editingChapter, color: c })}
                    className={`w-8 h-8 rounded-full ${c} transition-transform ${editingChapter.color === c ? "scale-110 ring-2 ring-offset-2 ring-primary" : ""}`}
                  />
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingChapter(null)}>Cancel</Button>
            <Button onClick={saveEditChapter}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default LifeCapsule;
