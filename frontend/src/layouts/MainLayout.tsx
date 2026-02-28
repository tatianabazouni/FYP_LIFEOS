import { useState } from "react";
import { motion } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Brain,
  BookOpen,
  Clock,
  Camera,
  Target,
  Eye,
  Users,
  BarChart3,
  Settings,
  Menu,
  ChevronLeft,
  Sparkles,
  Trophy,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/ai", icon: Brain, label: "AI Companion" },
  { path: "/journal", icon: BookOpen, label: "Journal" },
  { path: "/life-capsule", icon: Clock, label: "Life Capsule" },
  { path: "/daily-photo", icon: Camera, label: "Daily Photo" },
  { path: "/goals", icon: Target, label: "Goals" },
  { path: "/vision-boards", icon: Eye, label: "Vision Boards" },
  { path: "/connections", icon: Users, label: "Connections" },
  { path: "/achievements", icon: Trophy, label: "Achievements" },
  { path: "/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export default function MainLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300
          ${collapsed ? "w-[68px]" : "w-60"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="h-16 flex items-center px-4 gap-3 border-b border-sidebar-border">
          <Link
            to="/dashboard"
            className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center shrink-0"
          >
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </Link>
          {!collapsed && (
            <span className="font-display text-lg font-bold text-sidebar-foreground">
              LifeOS
            </span>
          )}
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    active
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }
                  ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-sidebar-border hidden md:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "md:ml-[68px]" : "md:ml-60"
        }`}
      >
        <header className="h-16 border-b border-border flex items-center px-6 gap-4 bg-background/80 backdrop-blur-md sticky top-0 z-30">
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-display text-xl font-bold text-foreground capitalize">
            {location.pathname.replace("/", "").replace("-", " ") ||
              "Dashboard"}
          </h1>
        </header>

        <div className="p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}