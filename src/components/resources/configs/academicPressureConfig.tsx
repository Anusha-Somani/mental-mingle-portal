
import { 
  Award, 
  BookOpen,
  Brain,
  Clock
} from "lucide-react";
import { createIconElement } from "../utils/iconUtils";
import { GameConfig } from "../types/gameTypes";

// Academic Pressure game configuration
export const academicPressureConfig: GameConfig = {
  title: "Academic Pressure Management",
  titleIcon: createIconElement(BookOpen),
  titleColor: "#FF8A48",
  startingModuleId: 101,
  modules: [
    {
      id: 101,
      title: "Study Planning",
      description: "Learn effective time management and study planning",
      icon: createIconElement(Clock),
      color: "#FF8A48",
      xp: 100,
      type: "article",
      content: "Content about study planning goes here..."
    },
    {
      id: 102,
      title: "Test Anxiety",
      description: "Techniques to manage test anxiety and stress",
      icon: createIconElement(Brain),
      color: "#FC68B3",
      xp: 150,
      type: "activity",
      content: "Interactive test anxiety management activity"
    },
    {
      id: 103,
      title: "Focus Techniques",
      description: "Methods to improve concentration and focus",
      icon: createIconElement(BookOpen),
      color: "#3DFDFF",
      xp: 200,
      type: "video",
      content: "https://www.youtube.com/embed/FhG-VoRtkKY"
    },
    {
      id: 104,
      title: "Goal Setting",
      description: "Setting realistic academic goals",
      icon: createIconElement(Award),
      color: "#F5DF4D",
      xp: 250,
      type: "article",
      content: "Content about goal setting goes here..."
    }
  ],
  badges: [
    {
      id: 101,
      title: "Organized Learner",
      description: "Complete your first academic module",
      icon: createIconElement(BookOpen),
      color: "#FF8A48",
      requiredModules: [101]
    },
    {
      id: 102,
      title: "Study Master",
      description: "Complete all academic modules",
      icon: createIconElement(Award),
      color: "#3DFDFF",
      requiredModules: [101, 102, 103, 104]
    }
  ]
};
