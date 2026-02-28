import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Star } from 'lucide-react';
import api from '@/services/api';
import { LoadingSpinner, ErrorState } from '@/components/StateHelpers';

interface GamificationData {
  xp: number;
  level: number;
  streak: number;
  badges: string[];
}

const allBadges = [
  { key: 'first_journal', name: 'First Entry', desc: 'Write your first journal entry', emoji: '✍️' },
  { key: 'goal_setter', name: 'Dream Setter', desc: 'Create your first goal', emoji: '🎯' },
  { key: 'goal_crusher', name: 'Goal Crusher', desc: 'Complete your first goal', emoji: '💪' },
  { key: 'memory_maker', name: 'Memory Maker', desc: 'Add memories to your capsule', emoji: '📸' },
  { key: 'streak_7', name: '7-Day Streak', desc: 'Stay active for 7 days in a row', emoji: '🔥' },
  { key: 'streak_30', name: '30-Day Legend', desc: 'Stay active for 30 days in a row', emoji: '👑' },
  { key: 'social', name: 'Social Butterfly', desc: 'Build meaningful connections', emoji: '🦋' },
];

export default function Achievements() {
  const [data, setData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGamification = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get<GamificationData>('/gamification');
      setData(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGamification();
  }, []);

  const normalized = useMemo(() => new Set((data?.badges || []).map((badge) => badge.toLowerCase())), [data?.badges]);

  if (loading) return <LoadingSpinner message="Loading achievements..." />;
  if (error) return <ErrorState message={error} onRetry={fetchGamification} />;

  const renderedBadges = allBadges.map((badge) => {
    const unlocked = normalized.has(badge.key) || normalized.has(badge.name.toLowerCase().replace(/\s+/g, '_'));
    return { ...badge, unlocked };
  });

  const unlockedCount = renderedBadges.filter((badge) => badge.unlocked).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="page-title">Achievements</h1>
      <p className="page-subtitle">Track your progress, levels, and milestone badges.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Trophy, label: 'Level', value: data?.level || 1, color: 'gradient-hero' },
          { icon: Flame, label: 'Streak', value: `${data?.streak || 0} days`, color: 'gradient-warm' },
          { icon: Star, label: 'Total XP', value: data?.xp || 0, color: 'gradient-sky' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
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

      <div>
        <h2 className="font-display text-xl font-bold mb-1 text-foreground">Badges</h2>
        <p className="text-sm text-muted-foreground mb-5">{unlockedCount} of {renderedBadges.length} unlocked</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {renderedBadges.map((badge, i) => (
            <motion.div
              key={badge.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-xl border shadow-card ${badge.unlocked ? 'bg-card border-border' : 'bg-muted/30 border-border/50 opacity-60'}`}
            >
              <span className="text-3xl">{badge.unlocked ? badge.emoji : '🔒'}</span>
              <div>
                <p className="font-semibold text-foreground text-sm">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
