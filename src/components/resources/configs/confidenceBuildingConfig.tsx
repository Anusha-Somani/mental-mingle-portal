
import { 
  Award, 
  Medal,
  Sparkles,
  Star
} from "lucide-react";
import { createIconElement } from "../utils/iconUtils";
import { GameConfig } from "../types/gameTypes";

// Confidence Building game configuration
export const confidenceBuildingConfig: GameConfig = {
  title: "Confidence Building Challenge",
  titleIcon: createIconElement(Star),
  titleColor: "#F5DF4D",
  startingModuleId: 301,
  modules: [
    {
      id: 301,
      title: "Positive Self-Talk",
      description: "Develop a positive internal dialogue",
      icon: createIconElement(Star),
      color: "#F5DF4D",
      xp: 100,
      type: "article",
      content: "Content about positive self-talk goes here..."
    },
    {
      id: 302,
      title: "Strengths Discovery",
      description: "Identify and build on your key strengths",
      icon: createIconElement(Medal),
      color: "#3DFDFF",
      xp: 150,
      type: "activity",
      content: "Interactive strengths discovery activity"
    },
    {
      id: 303,
      title: "Goal Achievement",
      description: "Set and achieve confidence-building goals",
      icon: createIconElement(Sparkles),
      color: "#FC68B3",
      xp: 200,
      type: "video",
      content: "https://www.youtube.com/embed/l_NYrWqUR40"
    },
    {
      id: 304,
      title: "Handling Criticism",
      description: "Learn to handle feedback constructively",
      icon: createIconElement(Award),
      color: "#FF8A48",
      xp: 250,
      type: "article",
      content: "Content about handling criticism goes here..."
    }
  ],
  badges: [
    {
      id: 301,
      title: "Self-Believer",
      description: "Complete your first confidence module",
      icon: createIconElement(Star),
      color: "#F5DF4D",
      requiredModules: [301]
    },
    {
      id: 302,
      title: "Confidence Champion",
      description: "Complete all confidence modules",
      icon: createIconElement(Award),
      color: "#FF8A48",
      requiredModules: [301, 302, 303, 304]
    }
  ]
};
