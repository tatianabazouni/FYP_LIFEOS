import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { UserPlus, Heart, Users, Check, X } from "lucide-react";

const connections = [
  { name: "Sarah Chen", type: "Couple", emoji: "💑", mutual: 3 },
  { name: "Alex Rivera", type: "Friend", emoji: "🤝", mutual: 5 },
  { name: "Mom", type: "Family", emoji: "👨‍👩‍👧", mutual: 2 },
];

const pendingRequests = [
  { name: "Jordan Lee", emoji: "👋" },
];

const Connections = () => {
  return (
    <AppLayout title="Connections">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Add */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex items-center gap-3 p-5 rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl gradient-sky flex items-center justify-center group-hover:scale-110 transition-transform">
            <UserPlus className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-medium text-muted-foreground">Add a friend, partner, or family member...</span>
        </motion.button>

        {/* Pending */}
        {pendingRequests.length > 0 && (
          <div>
            <h3 className="font-display text-lg font-bold mb-3 text-foreground">Pending Requests</h3>
            {pendingRequests.map((req) => (
              <div key={req.name} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-primary/20 shadow-card">
                <span className="text-2xl">{req.emoji}</span>
                <span className="flex-1 font-medium text-foreground">{req.name}</span>
                <button className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Check className="w-4 h-4 text-accent-foreground" />
                </button>
                <button className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:opacity-80 transition-opacity">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* My Connections */}
        <div>
          <h3 className="font-display text-lg font-bold mb-3 text-foreground">My Circle</h3>
          <div className="space-y-3">
            {connections.map((conn, i) => (
              <motion.div
                key={conn.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
              >
                <span className="text-2xl">{conn.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{conn.name}</p>
                  <p className="text-xs text-muted-foreground">{conn.type} · {conn.mutual} shared goals</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Connections;
