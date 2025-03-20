
import { 
  Award, 
  BookOpen, 
  Heart, 
  MessageCircle,
  Shield,
  ShieldCheck, 
  Trophy,
  Users
} from "lucide-react";
import { createIconElement } from "../utils/iconUtils";
import { GameConfig } from "../types/gameTypes";

// Bullying game configuration
export const bullyingConfig: GameConfig = {
  title: "Bullying Response Training",
  titleIcon: createIconElement(Shield),
  titleColor: "#3DFDFF",
  startingModuleId: 1,
  modules: [
    {
      id: 1,
      title: "Understanding Bullying",
      description: "Learn to recognize different forms of bullying behavior",
      icon: createIconElement(BookOpen),
      color: "#3DFDFF",
      xp: 100,
      type: "article",
      content: "Content about understanding bullying goes here..."
    },
    {
      id: 2,
      title: "Bystander Training",
      description: "Develop skills to safely intervene or get help",
      icon: createIconElement(Users),
      color: "#FC68B3",
      xp: 150,
      type: "video",
      content: "https://www.youtube.com/embed/CFbp9NcQF6U"
    },
    {
      id: 3,
      title: "Self-Defense Strategies",
      description: "Non-violent ways to protect yourself",
      icon: createIconElement(Shield),
      color: "#FF8A48",
      xp: 200,
      type: "activity",
      content: "Interactive self-defense strategies activity"
    },
    {
      id: 4,
      title: "Communication Skills",
      description: "Learn to express feelings and set boundaries",
      icon: createIconElement(MessageCircle),
      color: "#F5DF4D",
      xp: 250,
      type: "article",
      content: "Content about communication skills goes here..."
    },
    {
      id: 5,
      title: "Building Resilience",
      description: "Develop emotional strength and confidence",
      icon: createIconElement(Heart),
      color: "#2AC20E",
      xp: 300,
      type: "video",
      content: "https://www.youtube.com/embed/ynTuA_tlZDE"
    }
  ],
  badges: [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first module",
      icon: createIconElement(Trophy),
      color: "#3DFDFF",
      requiredModules: [1]
    },
    {
      id: 2,
      title: "Halfway Hero",
      description: "Complete 3 modules",
      icon: createIconElement(Shield),
      color: "#FC68B3",
      requiredModules: [1, 2, 3]
    },
    {
      id: 3,
      title: "Resilience Master",
      description: "Complete all modules",
      icon: createIconElement(Award),
      color: "#F5DF4D",
      requiredModules: [1, 2, 3, 4, 5]
    }
  ]
};
