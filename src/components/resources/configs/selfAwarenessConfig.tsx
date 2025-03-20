
import { 
  Award, 
  Heart, 
  MessageCircle,
  Sparkles,
  Eye,
  Lightbulb,
  Footprints,
  Glasses,
  Scale,
  Cog
} from "lucide-react";
import { createIconElement } from "../utils/iconUtils";
import { GameConfig } from "../types/gameTypes";

// Self Awareness game configuration
export const selfAwarenessConfig: GameConfig = {
  title: "Self-Awareness Journey",
  titleIcon: createIconElement(Heart),
  titleColor: "#FC68B3",
  startingModuleId: 201,
  modules: [
    {
      id: 201,
      title: "Emotion Awareness",
      description: "Learn to recognize and name your emotions",
      icon: createIconElement(Heart),
      color: "#FC68B3",
      xp: 100,
      type: "activity",
      content: "Interactive emotion awareness activity"
    },
    {
      id: 202,
      title: "Emotional Hacking",
      description: "Practical exercises to regulate your emotions",
      icon: createIconElement(Cog),
      color: "#3DFDFF",
      xp: 150,
      type: "activity",
      content: "Interactive emotional regulation exercises"
    },
    {
      id: 203,
      title: "Communication Skills",
      description: "Express your feelings effectively to others",
      icon: createIconElement(MessageCircle),
      color: "#3DFDFF",
      xp: 150,
      type: "article",
      content: "Content about communication skills goes here..."
    },
    {
      id: 204,
      title: "Mindfulness Practice",
      description: "Stay present and aware of your thoughts",
      icon: createIconElement(Sparkles),
      color: "#FF8A48",
      xp: 200,
      type: "video",
      content: "https://www.youtube.com/embed/tGdsOXZpyWE"
    },
    {
      id: 205,
      title: "Self-Reflection",
      description: "Techniques for understanding your behavior",
      icon: createIconElement(Eye),
      color: "#F5DF4D",
      xp: 250,
      type: "activity",
      content: "Interactive self-reflection activity"
    },
    {
      id: 206,
      title: "Values Exploration",
      description: "Discover what matters most to you",
      icon: createIconElement(Lightbulb),
      color: "#2AC20E",
      xp: 300,
      type: "article",
      content: "Content about values exploration goes here..."
    },
    {
      id: 207,
      title: "Personal Growth Plan",
      description: "Create roadmaps for emotional development",
      icon: createIconElement(Footprints),
      color: "#D5D5F1",
      xp: 350,
      type: "activity",
      content: "Interactive personal growth planning activity"
    },
    {
      id: 208,
      title: "Perspective Taking",
      description: "Understanding different viewpoints",
      icon: createIconElement(Glasses),
      color: "#FF8A48",
      xp: 400,
      type: "video",
      content: "https://www.youtube.com/embed/OsWlVsDYYmw"
    },
    {
      id: 209,
      title: "Emotional Regulation",
      description: "Strategies to manage strong emotions",
      icon: createIconElement(Scale),
      color: "#FC68B3",
      xp: 450,
      type: "article",
      content: "Content about emotional regulation goes here..."
    }
  ],
  badges: [
    {
      id: 201,
      title: "Emotional Explorer",
      description: "Complete your first self-awareness module",
      icon: createIconElement(Heart),
      color: "#FC68B3",
      requiredModules: [201]
    },
    {
      id: 202,
      title: "Emotional Hacker",
      description: "Complete Emotion Awareness and Emotional Hacking modules",
      icon: createIconElement(Cog),
      color: "#3DFDFF",
      requiredModules: [201, 202]
    },
    {
      id: 203,
      title: "Mindfulness Guru",
      description: "Complete 4 self-awareness modules",
      icon: createIconElement(Sparkles),
      color: "#FF8A48",
      requiredModules: [201, 202, 203, 204]
    },
    {
      id: 204,
      title: "Self-Awareness Master",
      description: "Complete all self-awareness modules",
      icon: createIconElement(Award),
      color: "#3DFDFF",
      requiredModules: [201, 202, 203, 204, 205, 206, 207, 208, 209]
    },
    {
      id: 205,
      title: "Growth Champion",
      description: "Earn 1000+ XP in self-awareness",
      icon: createIconElement(Trophy),
      color: "#2AC20E",
      requiredModules: [201, 202, 203, 204, 205, 206]
    }
  ]
};
