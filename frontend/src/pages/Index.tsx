import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Target, Image, Camera, Trophy, Sparkles, Heart, Users } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Journal", desc: "Reflect daily, track moods, and grow mindfully.", color: "gradient-warm" },
  { icon: Target, title: "Life Goals", desc: "Dream big, plan steps, and achieve meaningful outcomes.", color: "gradient-sage" },
  { icon: Image, title: "Vision Boards", desc: "Visualize your future and convert dreams into real goals.", color: "gradient-sky" },
  { icon: Camera, title: "Daily Photo", desc: "Capture one photo each day to build your life story.", color: "gradient-rose" },
  { icon: Trophy, title: "Gamification", desc: "Earn XP, level up, and unlock badges.", color: "gradient-hero" },
  { icon: Sparkles, title: "AI Companion", desc: "Receive AI-powered reflections, summaries, and motivation.", color: "gradient-warm" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">LifeOS</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium px-4 py-2 rounded-lg gradient-hero text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary">
              Your life, beautifully organized
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Design the life <span className="text-gradient-hero">you dream of</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              LifeOS helps you document your life, track growth, and stay motivated with AI assistance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register" className="px-8 py-3.5 rounded-xl gradient-hero text-primary-foreground font-semibold text-base shadow-elevated hover:opacity-90 transition-all">
              Start Your Journey
            </Link>
            <a href="#features" className="px-8 py-3.5 rounded-xl bg-card border border-border font-semibold text-base shadow-card hover:shadow-elevated transition-all text-foreground">
              Explore Features
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-card border border-border shadow-card">
            <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2 text-foreground">Personal Space</h3>
            <p className="text-muted-foreground leading-relaxed">Journal, track goals, and preserve memories in your private space.</p>
          </div>
          <div className="p-8 rounded-2xl bg-card border border-border shadow-card">
            <div className="w-12 h-12 rounded-xl gradient-sage flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2 text-foreground">Shared Space</h3>
            <p className="text-muted-foreground leading-relaxed">Collaborate with connections through shared ambitions and growth journeys.</p>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">Everything for your life journey</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Powerful tools designed around real life growth and reflection.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow group"
              >
                <div className={`w-10 h-10 rounded-lg ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold mb-1 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
