
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import Resources from "@/pages/Resources";
import ResourceHub from "@/pages/ResourceHub";
import Puzzle from "@/pages/Puzzle";
import TetrisGame from "@/pages/TetrisGame";
import EmotionQuest from "@/pages/EmotionQuest";
import ResiliencyBingo from "@/pages/ResiliencyBingo";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resource-hub" element={<ResourceHub />} />
            <Route path="/puzzle" element={<Puzzle />} />
            <Route path="/tetris" element={<TetrisGame />} />
            <Route path="/emotion-quest" element={<EmotionQuest />} />
            <Route path="/resiliency-bingo" element={<ResiliencyBingo />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
