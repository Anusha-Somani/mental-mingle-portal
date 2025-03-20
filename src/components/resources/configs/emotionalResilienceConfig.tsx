
import { 
  Brain,
  Cloud,
  Shield
} from "lucide-react";
import { createIconElement } from "../utils/iconUtils";
import { GameConfig } from "../types/gameTypes";
import { createCustomGame } from "./gameFactory";

// Emotional Resilience game configuration
export const emotionalResilienceConfig: GameConfig = createCustomGame({
  title: "Emotional Resilience Training",
  titleIcon: createIconElement(Cloud),
  titleColor: "#3DFDFF",
  startingModuleId: 501,
  modules: [
    {
      id: 501,
      title: "Stress Management",
      description: "Techniques to handle stress effectively",
      icon: createIconElement(Brain),
      color: "#3DFDFF",
      xp: 100,
      type: "article",
      content: "Content about stress management goes here..."
    },
    {
      id: 502,
      title: "Coping Strategies",
      description: "Healthy ways to deal with difficulties",
      icon: createIconElement(Shield),
      color: "#FC68B3",
      xp: 150,
      type: "activity",
      content: "Interactive coping strategies activity"
    }
  ],
  badges: [
    {
      id: 501,
      title: "Resilience Starter",
      description: "Complete your first resilience module",
      icon: createIconElement(Shield),
      color: "#3DFDFF",
      requiredModules: [501]
    }
  ]
});
