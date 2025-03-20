
import { 
  Award, 
  PersonStanding,
  ShieldCheck,
  Users
} from "lucide-react";
import { createIconElement } from "../utils/iconUtils";
import { GameConfig } from "../types/gameTypes";

// Peer Pressure game configuration
export const peerPressureConfig: GameConfig = {
  title: "Peer Pressure Defense",
  titleIcon: createIconElement(Users),
  titleColor: "#2AC20E",
  startingModuleId: 401,
  modules: [
    {
      id: 401,
      title: "Recognizing Pressure",
      description: "Learn to identify peer pressure situations",
      icon: createIconElement(Users),
      color: "#2AC20E",
      xp: 100,
      type: "article",
      content: "Content about recognizing pressure goes here..."
    },
    {
      id: 402,
      title: "Resistance Techniques",
      description: "Strategies to say no effectively",
      icon: createIconElement(ShieldCheck),
      color: "#3DFDFF",
      xp: 150,
      type: "video",
      content: "https://www.youtube.com/embed/MUTn3psCH-8"
    },
    {
      id: 403,
      title: "Building Boundaries",
      description: "Create healthy boundaries with friends",
      icon: createIconElement(PersonStanding),
      color: "#FC68B3",
      xp: 200,
      type: "activity",
      content: "Interactive boundary-setting activity"
    },
    {
      id: 404,
      title: "Positive Influence",
      description: "Being a positive influence for others",
      icon: createIconElement(Award),
      color: "#F5DF4D",
      xp: 250,
      type: "article",
      content: "Content about being a positive influence goes here..."
    }
  ],
  badges: [
    {
      id: 401,
      title: "Pressure Spotter",
      description: "Complete your first peer pressure module",
      icon: createIconElement(Users),
      color: "#2AC20E",
      requiredModules: [401]
    },
    {
      id: 402,
      title: "Social Master",
      description: "Complete all peer pressure modules",
      icon: createIconElement(Award),
      color: "#F5DF4D",
      requiredModules: [401, 402, 403, 404]
    }
  ]
};
