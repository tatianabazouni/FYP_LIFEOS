import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import Goals from "./pages/Goals";
import VisionBoards from "./pages/VisionBoards";
import DailyPhoto from "./pages/DailyPhoto";
import Achievements from "./pages/Achievements";
import Connections from "./pages/Connections";
import AICompanion from "./pages/AICompanion";
import LifeCapsule from "./pages/LifeCapsule";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/vision-boards" element={<VisionBoards />} />
          <Route path="/daily-photo" element={<DailyPhoto />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/life-capsule" element={<LifeCapsule />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/ai" element={<AICompanion />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
