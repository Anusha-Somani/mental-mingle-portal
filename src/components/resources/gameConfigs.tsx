
import React from 'react';
import { 
  Award, 
  BookOpen, 
  Brain,
  Clock,
  FileText, 
  Heart, 
  Medal,
  MessageCircle,
  PersonStanding,
  Shield,
  ShieldCheck, 
  Sparkles,
  Star,
  Trophy,
  Users,
  Lightbulb,
  Footprints,
  Eye,
  Glasses,
  Scale,
  Cloud
} from "lucide-react";

// Helper function to create JSX elements from Lucide icons
const createIconElement = (IconComponent: any, color: string = "currentColor") => {
  return <IconComponent color={color} />;
};

// Type definition for module
type ModuleType = "video" | "activity" | "article";

// Bullying game configuration
export const bullyingConfig = {
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
      type: "article" as ModuleType,
      content: "Content about understanding bullying goes here..."
    },
    {
      id: 2,
      title: "Bystander Training",
      description: "Develop skills to safely intervene or get help",
      icon: createIconElement(Users),
      color: "#FC68B3",
      xp: 150,
      type: "video" as ModuleType,
      content: "https://www.youtube.com/embed/CFbp9NcQF6U"
    },
    {
      id: 3,
      title: "Self-Defense Strategies",
      description: "Non-violent ways to protect yourself",
      icon: createIconElement(Shield),
      color: "#FF8A48",
      xp: 200,
      type: "activity" as ModuleType,
      content: "Interactive self-defense strategies activity"
    },
    {
      id: 4,
      title: "Communication Skills",
      description: "Learn to express feelings and set boundaries",
      icon: createIconElement(MessageCircle),
      color: "#F5DF4D",
      xp: 250,
      type: "article" as ModuleType,
      content: "Content about communication skills goes here..."
    },
    {
      id: 5,
      title: "Building Resilience",
      description: "Develop emotional strength and confidence",
      icon: createIconElement(Heart),
      color: "#2AC20E",
      xp: 300,
      type: "video" as ModuleType,
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

// Academic Pressure game configuration
export const academicPressureConfig = {
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
      type: "article" as ModuleType,
      content: "Content about study planning goes here..."
    },
    {
      id: 102,
      title: "Test Anxiety",
      description: "Techniques to manage test anxiety and stress",
      icon: createIconElement(Brain),
      color: "#FC68B3",
      xp: 150,
      type: "activity" as ModuleType,
      content: "Interactive test anxiety management activity"
    },
    {
      id: 103,
      title: "Focus Techniques",
      description: "Methods to improve concentration and focus",
      icon: createIconElement(BookOpen),
      color: "#3DFDFF",
      xp: 200,
      type: "video" as ModuleType,
      content: "https://www.youtube.com/embed/FhG-VoRtkKY"
    },
    {
      id: 104,
      title: "Goal Setting",
      description: "Setting realistic academic goals",
      icon: createIconElement(Award),
      color: "#F5DF4D",
      xp: 250,
      type: "article" as ModuleType,
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

// Self Awareness game configuration
export const selfAwarenessConfig = {
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
      type: "activity" as ModuleType,
      content: "Interactive emotion awareness activity"
    },
    {
      id: 202,
      title: "Communication Skills",
      description: "Express your feelings effectively to others",
      icon: createIconElement(MessageCircle),
      color: "#3DFDFF",
      xp: 150,
      type: "article" as ModuleType,
      content: "Content about communication skills goes here..."
    },
    {
      id: 203,
      title: "Mindfulness Practice",
      description: "Stay present and aware of your thoughts",
      icon: createIconElement(Sparkles),
      color: "#FF8A48",
      xp: 200,
      type: "video" as ModuleType,
      content: "https://www.youtube.com/embed/tGdsOXZpyWE"
    },
    {
      id: 204,
      title: "Self-Reflection",
      description: "Techniques for understanding your behavior",
      icon: createIconElement(Eye),
      color: "#F5DF4D",
      xp: 250,
      type: "activity" as ModuleType,
      content: "Interactive self-reflection activity"
    },
    {
      id: 205,
      title: "Values Exploration",
      description: "Discover what matters most to you",
      icon: createIconElement(Lightbulb),
      color: "#2AC20E",
      xp: 300,
      type: "article" as ModuleType,
      content: "Content about values exploration goes here..."
    },
    {
      id: 206,
      title: "Personal Growth Plan",
      description: "Create roadmaps for emotional development",
      icon: createIconElement(Footprints),
      color: "#D5D5F1",
      xp: 350,
      type: "activity" as ModuleType,
      content: "Interactive personal growth planning activity"
    },
    {
      id: 207,
      title: "Perspective Taking",
      description: "Understanding different viewpoints",
      icon: createIconElement(Glasses),
      color: "#FF8A48",
      xp: 400,
      type: "video" as ModuleType,
      content: "https://www.youtube.com/embed/OsWlVsDYYmw"
    },
    {
      id: 208,
      title: "Emotional Regulation",
      description: "Strategies to manage strong emotions",
      icon: createIconElement(Scale),
      color: "#FC68B3",
      xp: 450,
      type: "article" as ModuleType,
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
      title: "Mindfulness Guru",
      description: "Complete 4 self-awareness modules",
      icon: createIconElement(Sparkles),
      color: "#FF8A48",
      requiredModules: [201, 202, 203, 204]
    },
    {
      id: 203,
      title: "Self-Awareness Master",
      description: "Complete all self-awareness modules",
      icon: createIconElement(Award),
      color: "#3DFDFF",
      requiredModules: [201, 202, 203, 204, 205, 206, 207, 208]
    },
    {
      id: 204,
      title: "Growth Champion",
      description: "Earn 1000+ XP in self-awareness",
      icon: createIconElement(Trophy),
      color: "#2AC20E",
      requiredModules: [201, 202, 203, 204, 205, 206]
    }
  ]
};

// Confidence Building game configuration
export const confidenceBuildingConfig = {
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
      type: "article" as ModuleType,
      content: "Content about positive self-talk goes here..."
    },
    {
      id: 302,
      title: "Strengths Discovery",
      description: "Identify and build on your key strengths",
      icon: createIconElement(Medal),
      color: "#3DFDFF",
      xp: 150,
      type: "activity" as ModuleType,
      content: "Interactive strengths discovery activity"
    },
    {
      id: 303,
      title: "Goal Achievement",
      description: "Set and achieve confidence-building goals",
      icon: createIconElement(Sparkles),
      color: "#FC68B3",
      xp: 200,
      type: "video" as ModuleType,
      content: "https://www.youtube.com/embed/l_NYrWqUR40"
    },
    {
      id: 304,
      title: "Handling Criticism",
      description: "Learn to handle feedback constructively",
      icon: createIconElement(Award),
      color: "#FF8A48",
      xp: 250,
      type: "article" as ModuleType,
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

// Peer Pressure game configuration
export const peerPressureConfig = {
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
      type: "article" as ModuleType,
      content: "Content about recognizing pressure goes here..."
    },
    {
      id: 402,
      title: "Resistance Techniques",
      description: "Strategies to say no effectively",
      icon: createIconElement(ShieldCheck),
      color: "#3DFDFF",
      xp: 150,
      type: "video" as ModuleType,
      content: "https://www.youtube.com/embed/MUTn3psCH-8"
    },
    {
      id: 403,
      title: "Building Boundaries",
      description: "Create healthy boundaries with friends",
      icon: createIconElement(PersonStanding),
      color: "#FC68B3",
      xp: 200,
      type: "activity" as ModuleType,
      content: "Interactive boundary-setting activity"
    },
    {
      id: 404,
      title: "Positive Influence",
      description: "Being a positive influence for others",
      icon: createIconElement(Award),
      color: "#F5DF4D",
      xp: 250,
      type: "article" as ModuleType,
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

// Customizable game configuration template that can be used to create new games
export const createCustomGame = (config: any) => {
  const defaultConfig = {
    title: "Custom Game",
    titleIcon: createIconElement(Star),
    titleColor: "#FC68B3",
    startingModuleId: 1001,
    modules: [],
    badges: []
  };
  
  return { ...defaultConfig, ...config };
};

// Example of creating a new game with the template
export const emotionalResilienceConfig = createCustomGame({
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
      type: "article" as ModuleType,
      content: "Content about stress management goes here..."
    },
    {
      id: 502,
      title: "Coping Strategies",
      description: "Healthy ways to deal with difficulties",
      icon: createIconElement(Shield),
      color: "#FC68B3",
      xp: 150,
      type: "activity" as ModuleType,
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
