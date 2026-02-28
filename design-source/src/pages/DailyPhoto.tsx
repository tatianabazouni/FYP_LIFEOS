import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Camera, Flame, X, Image } from "lucide-react";

interface DayEntry {
  date: string;
  hasPhoto: boolean;
  today?: boolean;
  emoji?: string;
  photoUrl?: string;
}

const initialDays: DayEntry[] = [
  { date: "Feb 15", hasPhoto: false, today: true },
  { date: "Feb 14", hasPhoto: true, emoji: "💕" },
  { date: "Feb 13", hasPhoto: true, emoji: "🌇" },
  { date: "Feb 12", hasPhoto: true, emoji: "☕" },
  { date: "Feb 11", hasPhoto: true, emoji: "📖" },
  { date: "Feb 10", hasPhoto: true, emoji: "🏃" },
  { date: "Feb 9", hasPhoto: true, emoji: "🎵" },
  { date: "Feb 8", hasPhoto: true, emoji: "🌅" },
];

const DailyPhoto = () => {
  const [days, setDays] = useState<DayEntry[]>(initialDays);
  const [todayPhoto, setTodayPhoto] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const streak = days.filter((d) => d.hasPhoto || d.today).length - (todayPhoto ? 0 : 1);

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setTodayPhoto(url);
      setDays((prev) =>
        prev.map((d) =>
          d.today ? { ...d, hasPhoto: true, emoji: "📸", photoUrl: url } : d
        )
      );
    };
    reader.readAsDataURL(file);
    // Reset so same file can be re-selected
    e.target.value = "";
  };

  return (
    <AppLayout title="Daily Photo">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Today's prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl bg-card border border-border shadow-card text-center"
        >
          {todayPhoto ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={todayPhoto}
                  alt="Today's photo"
                  className="w-full max-h-72 object-cover rounded-xl cursor-pointer"
                  onClick={() => setShowPreview(true)}
                />
                <button
                  onClick={() => {
                    setTodayPhoto(null);
                    setDays((prev) =>
                      prev.map((d) =>
                        d.today ? { ...d, hasPhoto: false, emoji: undefined, photoUrl: undefined } : d
                      )
                    );
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur hover:bg-destructive/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">Today's moment captured! ✨</p>
              <button
                onClick={handleCapture}
                className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                Retake Photo
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl gradient-rose flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Capture Today</h2>
              <p className="text-muted-foreground mb-6">
                One photo to remember this day. What moment defines your Saturday?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCapture}
                  className="px-6 py-3 rounded-xl gradient-rose text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" /> Take Photo
                </button>
              </div>
            </>
          )}
        </motion.div>

        {/* Streak */}
        <div className="flex items-center justify-center gap-3">
          <Flame className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">{streak} day streak!</span>
          <span className="text-sm text-muted-foreground">Keep it going 🔥</span>
        </div>

        {/* Calendar Grid */}
        <div>
          <h3 className="font-display text-lg font-bold mb-4 text-foreground">This Week</h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {days.map((day, i) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border transition-all overflow-hidden relative
                  ${
                    day.today && !day.hasPhoto
                      ? "border-primary border-dashed bg-primary/5"
                      : day.hasPhoto
                      ? "border-border bg-card shadow-card"
                      : "border-border bg-muted/50"
                  }`}
              >
                {day.photoUrl ? (
                  <>
                    <img
                      src={day.photoUrl}
                      alt={day.date}
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                    <span className="text-xl relative z-10">📸</span>
                  </>
                ) : day.today && !day.hasPhoto ? (
                  <Camera className="w-5 h-5 text-primary" />
                ) : (
                  <span className="text-xl">{day.emoji}</span>
                )}
                <span className="text-[10px] text-muted-foreground font-medium relative z-10">{day.date}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Preview Modal */}
      <AnimatePresence>
        {showPreview && todayPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <button className="absolute top-4 right-4 p-2 text-white/80 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <img src={todayPhoto} alt="Today's photo" className="max-w-full max-h-full object-contain rounded-xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default DailyPhoto;
