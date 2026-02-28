import { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Sparkles, Target, Quote, ListChecks, BookOpen, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { label: "Break down a dream into steps", icon: Target, desc: "Turn your big visions into actionable sub-goals" },
  { label: "Motivational quotes", icon: Quote, desc: "Get personalized motivational messages" },
  { label: "Prioritize daily tasks", icon: ListChecks, desc: "AI helps you focus on what matters most" },
  { label: "Weekly reflection", icon: BookOpen, desc: "Guided prompts for meaningful self-reflection" },
];

const AICompanion = () => {
  return (
    <AppLayout title="AI Companion">
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">AI Companion</h2>
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium">
            <Construction className="w-4 h-4" />
            Coming Soon — AI features require backend integration
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your AI life coach will help you break down dreams, prioritize tasks, reflect on your week, and stay motivated.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-card border border-border shadow-card"
            >
              <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-1">{f.label}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default AICompanion;
