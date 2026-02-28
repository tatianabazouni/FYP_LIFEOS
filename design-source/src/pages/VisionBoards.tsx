import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Plus, Edit2, Trash2, ArrowLeft, Check, Target, Star, X, ImagePlus, Heart } from "lucide-react";
import { saveConvertedGoal } from "@/lib/goalStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";

interface Pin {
  id: string;
  imageUrl: string;
  caption: string;
  emoji: string;
  status: "dream" | "in-progress" | "reality";
  note?: string;
  liked?: boolean;
}

interface Board {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  color: string;
  pins: Pin[];
}

const boardColors = ["gradient-hero", "gradient-sky", "gradient-sage", "gradient-warm", "gradient-rose"];
const itemEmojis = ["🌟", "🏡", "✈️", "💻", "🎯", "📚", "🧘", "🎨", "🚀", "❤️", "🏔️", "🎸", "🌅", "💪", "🗺️"];

// Sample stock images for demo pins
const sampleImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=700&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=550&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=650&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=500&fit=crop",
];

const VisionBoards = () => {
  const [boards, setBoards] = useState<Board[]>([
    {
      id: "1", title: "Dream Life 2026", description: "Everything I want to manifest this year", color: "gradient-hero",
      coverImage: sampleImages[0],
      pins: [
        { id: "v1", imageUrl: sampleImages[0], caption: "Own my dream apartment", emoji: "🏡", status: "dream" },
        { id: "v2", imageUrl: sampleImages[1], caption: "Travel to Japan", emoji: "🗾", status: "in-progress", note: "Booked flights for October!" },
        { id: "v3", imageUrl: sampleImages[2], caption: "Launch my side project", emoji: "🚀", status: "reality", note: "LifeOS is live! 🎉" },
        { id: "v4", imageUrl: sampleImages[3], caption: "Read 24 books", emoji: "📚", status: "in-progress", note: "12 down, 12 to go" },
        { id: "v5", imageUrl: sampleImages[4], caption: "Mountain retreat", emoji: "🏔️", status: "dream" },
        { id: "v6", imageUrl: sampleImages[5], caption: "Morning routine mastery", emoji: "🌅", status: "in-progress" },
      ],
    },
    {
      id: "2", title: "Career Vision", description: "Professional growth path", color: "gradient-sky",
      coverImage: sampleImages[6],
      pins: [
        { id: "v7", imageUrl: sampleImages[6], caption: "Get promoted", emoji: "💼", status: "dream" },
        { id: "v8", imageUrl: sampleImages[4], caption: "Learn system design", emoji: "💻", status: "in-progress" },
        { id: "v9", imageUrl: sampleImages[2], caption: "Build portfolio site", emoji: "🎨", status: "reality", note: "Deployed last month!" },
      ],
    },
  ]);

  const [activeBoard, setActiveBoard] = useState<string | null>(null);
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConvertGoal, setShowConvertGoal] = useState<Pin | null>(null);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // New board form
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardDesc, setNewBoardDesc] = useState("");
  const [newBoardColor, setNewBoardColor] = useState("gradient-hero");

  // New pin form
  const [newPinCaption, setNewPinCaption] = useState("");
  const [newPinEmoji, setNewPinEmoji] = useState("🌟");
  const [newPinImage, setNewPinImage] = useState<string | null>(null);

  const currentBoard = boards.find(b => b.id === activeBoard);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  const createBoard = () => {
    if (!newBoardTitle.trim()) return;
    const board: Board = {
      id: Date.now().toString(),
      title: newBoardTitle,
      description: newBoardDesc,
      color: newBoardColor,
      pins: [],
    };
    setBoards([...boards, board]);
    setNewBoardTitle("");
    setNewBoardDesc("");
    setShowNewBoard(false);
    setActiveBoard(board.id);
  };

  const saveEditBoard = () => {
    if (!editingBoard) return;
    setBoards(boards.map(b => b.id === editingBoard.id ? editingBoard : b));
    setEditingBoard(null);
  };

  const deleteBoard = (boardId: string) => {
    setBoards(boards.filter(b => b.id !== boardId));
    if (activeBoard === boardId) setActiveBoard(null);
  };

  const addPin = () => {
    if (!newPinCaption.trim() || !activeBoard) return;
    const pin: Pin = {
      id: Date.now().toString(),
      caption: newPinCaption,
      emoji: newPinEmoji,
      imageUrl: newPinImage || sampleImages[Math.floor(Math.random() * sampleImages.length)],
      status: "dream",
    };
    setBoards(boards.map(b =>
      b.id === activeBoard ? { ...b, pins: [...b.pins, pin] } : b
    ));
    setNewPinCaption("");
    setNewPinEmoji("🌟");
    setNewPinImage(null);
    setShowNewPin(false);
  };

  const updatePinStatus = (pinId: string, status: Pin["status"]) => {
    if (!activeBoard) return;
    setBoards(boards.map(b =>
      b.id === activeBoard
        ? { ...b, pins: b.pins.map(p => p.id === pinId ? { ...p, status } : p) }
        : b
    ));
  };

  const togglePinLike = (pinId: string) => {
    if (!activeBoard) return;
    setBoards(boards.map(b =>
      b.id === activeBoard
        ? { ...b, pins: b.pins.map(p => p.id === pinId ? { ...p, liked: !p.liked } : p) }
        : b
    ));
  };

  const deletePin = (pinId: string) => {
    if (!activeBoard) return;
    setBoards(boards.map(b =>
      b.id === activeBoard
        ? { ...b, pins: b.pins.filter(p => p.id !== pinId) }
        : b
    ));
    if (selectedPin?.id === pinId) setSelectedPin(null);
  };

  const statusBadge = {
    dream: { label: "Dream", cls: "bg-muted text-muted-foreground" },
    "in-progress": { label: "Working on it", cls: "bg-primary/10 text-primary" },
    reality: { label: "Reality ✨", cls: "bg-accent/10 text-accent" },
  };

  // ── Board Detail (Pinterest Masonry) ──
  if (currentBoard) {
    // Split pins into columns for masonry
    const cols = 3;
    const columns: Pin[][] = Array.from({ length: cols }, () => []);
    currentBoard.pins.forEach((pin, i) => columns[i % cols].push(pin));

    return (
      <AppLayout title="Vision Boards">
        <div className="max-w-5xl mx-auto space-y-5">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setActiveBoard(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-foreground">{currentBoard.title}</h2>
              <p className="text-sm text-muted-foreground">{currentBoard.description} · {currentBoard.pins.length} pins</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowNewPin(true)}>
              <ImagePlus className="w-4 h-4 mr-1" /> Add Pin
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEditingBoard({ ...currentBoard })}>
              <Edit2 className="w-4 h-4 mr-1" /> Edit
            </Button>
          </div>

          {/* Masonry Grid */}
          {currentBoard.pins.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <ImagePlus className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No pins yet. Start building your vision!</p>
              <Button onClick={() => setShowNewPin(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add Your First Pin
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {columns.map((col, ci) => (
                <div key={ci} className="space-y-4">
                  {col.map((pin, pi) => (
                    <motion.div
                      key={pin.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (ci * col.length + pi) * 0.05 }}
                      className="rounded-2xl overflow-hidden bg-card border border-border shadow-card hover:shadow-elevated transition-all group cursor-pointer"
                      onClick={() => setSelectedPin(pin)}
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden">
                        <img
                          src={pin.imageUrl}
                          alt={pin.caption}
                          className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ minHeight: "140px", maxHeight: `${200 + (pi % 3) * 80}px` }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=500&fit=crop";
                          }}
                        />
                        {/* Overlay actions */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[pin.status].cls}`}>
                              {statusBadge[pin.status].label}
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); togglePinLike(pin.id); }}
                              className="p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
                            >
                              <Heart className={`w-4 h-4 ${pin.liked ? "fill-destructive text-destructive" : "text-foreground"}`} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Caption */}
                      <div className="p-3">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">{pin.emoji}</span>
                          <p className="text-sm font-medium text-foreground leading-snug">{pin.caption}</p>
                        </div>
                        {pin.note && <p className="text-xs text-muted-foreground mt-1.5 pl-7">{pin.note}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Add Pin Dialog ── */}
        <Dialog open={showNewPin} onOpenChange={setShowNewPin}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Pin</DialogTitle>
              <DialogDescription>Upload an image and describe your vision</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Image upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full h-48 rounded-xl border-2 border-dashed border-border hover:border-primary/40 cursor-pointer flex items-center justify-center overflow-hidden transition-colors"
              >
                {newPinImage ? (
                  <>
                    <img src={newPinImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setNewPinImage(null); }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <ImagePlus className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload an image</p>
                    <p className="text-xs text-muted-foreground/60">or leave empty for a random inspiration image</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, setNewPinImage)}
                />
              </div>

              <Input placeholder="Describe your vision..." value={newPinCaption} onChange={e => setNewPinCaption(e.target.value)} />

              {/* Emoji picker */}
              <div className="flex gap-1.5 flex-wrap">
                {itemEmojis.map(em => (
                  <button key={em} onClick={() => setNewPinEmoji(em)}
                    className={`text-lg p-1 rounded-lg transition-all ${newPinEmoji === em ? "bg-primary/10 scale-110" : "hover:bg-muted"}`}
                  >{em}</button>
                ))}
              </div>

              <Button onClick={addPin} className="w-full" disabled={!newPinCaption.trim()}>
                <Plus className="w-4 h-4 mr-1" /> Add Pin
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Pin Detail Dialog ── */}
        <Dialog open={!!selectedPin} onOpenChange={(open) => !open && setSelectedPin(null)}>
          <DialogContent className="sm:max-w-lg">
            {selectedPin && (
              <div className="space-y-4">
                <img
                  src={selectedPin.imageUrl}
                  alt={selectedPin.caption}
                  className="w-full max-h-[400px] object-cover rounded-xl"
                />
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{selectedPin.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-foreground">{selectedPin.caption}</h3>
                    {selectedPin.note && <p className="text-sm text-muted-foreground mt-1">{selectedPin.note}</p>}
                    <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge[selectedPin.status].cls}`}>
                      {statusBadge[selectedPin.status].label}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {selectedPin.status === "dream" && (
                    <Button size="sm" variant="outline" onClick={() => { updatePinStatus(selectedPin.id, "in-progress"); setSelectedPin({ ...selectedPin, status: "in-progress" }); }}>
                      <Target className="w-3.5 h-3.5 mr-1" /> Start Working
                    </Button>
                  )}
                  {selectedPin.status === "in-progress" && (
                    <Button size="sm" variant="outline" onClick={() => { updatePinStatus(selectedPin.id, "reality"); setSelectedPin({ ...selectedPin, status: "reality" }); }}>
                      <Check className="w-3.5 h-3.5 mr-1" /> Mark as Reality
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => { setShowConvertGoal(selectedPin); setSelectedPin(null); }}>
                    <Target className="w-3.5 h-3.5 mr-1" /> Convert to Goal
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deletePin(selectedPin.id)}>
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Convert to Goal Dialog ── */}
        <Dialog open={!!showConvertGoal} onOpenChange={(open) => !open && setShowConvertGoal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convert to Life Goal</DialogTitle>
              <DialogDescription>Turn "{showConvertGoal?.caption}" into a trackable goal on your Goals page</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                This vision will be converted into a goal with steps you can track on the <strong>Life Goals</strong> page.
              </p>
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                <span className="text-2xl">{showConvertGoal?.emoji}</span>
                <div>
                  <p className="font-medium text-foreground">{showConvertGoal?.caption}</p>
                  <p className="text-xs text-muted-foreground">From: {currentBoard?.title}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowConvertGoal(null)}>Cancel</Button>
              <Button onClick={() => {
                if (showConvertGoal && currentBoard) {
                  saveConvertedGoal({
                    id: Date.now().toString(),
                    title: showConvertGoal.caption,
                    emoji: showConvertGoal.emoji,
                    category: "Other",
                    sourceBoard: currentBoard.title,
                    steps: ["Plan first step", "Research & prepare", "Take action", "Review progress"],
                  });
                  updatePinStatus(showConvertGoal.id, "in-progress");
                }
                setShowConvertGoal(null);
              }}>
                <Target className="w-4 h-4 mr-1" /> Create Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Edit Board Dialog ── */}
        <Dialog open={!!editingBoard} onOpenChange={(open) => !open && setEditingBoard(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Board</DialogTitle>
              <DialogDescription>Update your vision board details</DialogDescription>
            </DialogHeader>
            {editingBoard && (
              <div className="space-y-4">
                <Input value={editingBoard.title} onChange={e => setEditingBoard({ ...editingBoard, title: e.target.value })} />
                <Textarea value={editingBoard.description} onChange={e => setEditingBoard({ ...editingBoard, description: e.target.value })} />
                <div className="flex gap-2">
                  {boardColors.map(c => (
                    <button key={c} onClick={() => setEditingBoard({ ...editingBoard, color: c })}
                      className={`w-8 h-8 rounded-full ${c} transition-transform ${editingBoard.color === c ? "scale-110 ring-2 ring-offset-2 ring-primary" : ""}`}
                    />
                  ))}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="ghost" onClick={() => setEditingBoard(null)}>Cancel</Button>
              <Button onClick={saveEditBoard}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AppLayout>
    );
  }

  // ── Board Grid View (Pinterest-style covers) ──
  return (
    <AppLayout title="Vision Boards">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* New Board */}
          {showNewBoard ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-card border border-border shadow-card p-5 space-y-3"
            >
              <Input placeholder="Board name" value={newBoardTitle} onChange={e => setNewBoardTitle(e.target.value)} />
              <Textarea placeholder="What's this board about?" value={newBoardDesc} onChange={e => setNewBoardDesc(e.target.value)} className="min-h-[50px]" />
              <div className="flex gap-2">
                {boardColors.map(c => (
                  <button key={c} onClick={() => setNewBoardColor(c)}
                    className={`w-7 h-7 rounded-full ${c} transition-transform ${newBoardColor === c ? "scale-110 ring-2 ring-offset-2 ring-primary" : ""}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={createBoard}>Create</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowNewBoard(false)}>Cancel</Button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowNewBoard(true)}
              className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 transition-colors min-h-[280px] group"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">New Board</span>
            </motion.button>
          )}

          {boards.map((board, i) => {
            const realityCount = board.pins.filter(p => p.status === "reality").length;
            // Show up to 4 preview thumbnails
            const previews = board.pins.slice(0, 4);

            return (
              <motion.div
                key={board.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-all group overflow-hidden"
              >
                <button onClick={() => setActiveBoard(board.id)} className="w-full text-left">
                  {/* Pinterest-style preview grid */}
                  <div className="h-48 overflow-hidden relative">
                    {previews.length > 0 ? (
                      <div className="grid grid-cols-2 gap-0.5 h-full">
                        {previews.length === 1 ? (
                          <img src={previews[0].imageUrl} alt="" className="w-full h-full object-cover col-span-2" />
                        ) : previews.length === 2 ? (
                          <>
                            <img src={previews[0].imageUrl} alt="" className="w-full h-full object-cover" />
                            <img src={previews[1].imageUrl} alt="" className="w-full h-full object-cover" />
                          </>
                        ) : previews.length === 3 ? (
                          <>
                            <img src={previews[0].imageUrl} alt="" className="w-full h-full object-cover row-span-2" />
                            <img src={previews[1].imageUrl} alt="" className="w-full h-full object-cover" />
                            <img src={previews[2].imageUrl} alt="" className="w-full h-full object-cover" />
                          </>
                        ) : (
                          <>
                            <img src={previews[0].imageUrl} alt="" className="w-full h-full object-cover" />
                            <img src={previews[1].imageUrl} alt="" className="w-full h-full object-cover" />
                            <img src={previews[2].imageUrl} alt="" className="w-full h-full object-cover" />
                            <img src={previews[3].imageUrl} alt="" className="w-full h-full object-cover" />
                          </>
                        )}
                      </div>
                    ) : (
                      <div className={`w-full h-full ${board.color} flex items-center justify-center`}>
                        <ImagePlus className="w-10 h-10 text-primary-foreground/60" />
                      </div>
                    )}
                    {realityCount > 0 && (
                      <span className="absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full bg-background/80 text-accent">
                        {realityCount} reality
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base font-bold text-foreground">{board.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {board.pins.length} pins · {board.description}
                    </p>
                  </div>
                </button>
                <div className="px-4 pb-3 flex gap-1">
                  <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setEditingBoard({ ...board })}>
                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs h-7 text-destructive hover:text-destructive" onClick={() => deleteBoard(board.id)}>
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Edit Board Dialog (grid view) */}
      <Dialog open={!!editingBoard} onOpenChange={(open) => !open && setEditingBoard(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
            <DialogDescription>Update your vision board details</DialogDescription>
          </DialogHeader>
          {editingBoard && (
            <div className="space-y-4">
              <Input value={editingBoard.title} onChange={e => setEditingBoard({ ...editingBoard, title: e.target.value })} />
              <Textarea value={editingBoard.description} onChange={e => setEditingBoard({ ...editingBoard, description: e.target.value })} />
              <div className="flex gap-2">
                {boardColors.map(c => (
                  <button key={c} onClick={() => setEditingBoard({ ...editingBoard, color: c })}
                    className={`w-8 h-8 rounded-full ${c} transition-transform ${editingBoard.color === c ? "scale-110 ring-2 ring-offset-2 ring-primary" : ""}`}
                  />
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingBoard(null)}>Cancel</Button>
            <Button onClick={saveEditBoard}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default VisionBoards;
