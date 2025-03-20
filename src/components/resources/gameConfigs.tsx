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
  LightbulbIcon,
  Lightbulb,
  Footprints,
  Eye,
  Glasses,
  Scale,
  Cloud
} from "lucide-react";

// Bullying game configuration
export const bullyingConfig = {
  title: "Bullying Response Training",
  titleIcon: Shield,
  titleColor: "#3DFDFF",
  startingModuleId: 1,
  modules: [
    {
      id: 1,
      title: "Understanding Bullying",
      description: "Learn to recognize different forms of bullying behavior",
      icon: BookOpen,
      color: "#3DFDFF",
      xp: 100
    },
    {
      id: 2,
      title: "Bystander Training",
      description: "Develop skills to safely intervene or get help",
      icon: Users,
      color: "#FC68B3",
      xp: 150
    },
    {
      id: 3,
      title: "Self-Defense Strategies",
      description: "Non-violent ways to protect yourself",
      icon: Shield,
      color: "#FF8A48",
      xp: 200
    },
    {
      id: 4,
      title: "Communication Skills",
      description: "Learn to express feelings and set boundaries",
      icon: MessageCircle,
      color: "#F5DF4D",
      xp: 250
    },
    {
      id: 5,
      title: "Building Resilience",
      description: "Develop emotional strength and confidence",
      icon: Heart,
      color: "#2AC20E",
      xp: 300
    }
  ],
  badges: [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first module",
      icon: Trophy,
      color: "#3DFDFF",
      condition: 1
    },
    {
      id: 2,
      title: "Halfway Hero",
      description: "Complete 3 modules",
      icon: Shield,
      color: "#FC68B3",
      condition: 3
    },
    {
      id: 3,
      title: "Resilience Master",
      description: "Complete all modules",
      icon: Award,
      color: "#F5DF4D",
      condition: 5
    }
  ]
};

// Academic Pressure game configuration
export const academicPressureConfig = {
  title: "Academic Pressure Management",
  titleIcon: BookOpen,
  titleColor: "#FF8A48",
  startingModuleId: 101,
  modules: [
    {
      id: 101,
      title: "Study Planning",
      description: "Learn effective time management and study planning",
      icon: Clock,
      color: "#FF8A48",
      xp: 100
    },
    {
      id: 102,
      title: "Test Anxiety",
      description: "Techniques to manage test anxiety and stress",
      icon: Brain,
      color: "#FC68B3",
      xp: 150
    },
    {
      id: 103,
      title: "Focus Techniques",
      description: "Methods to improve concentration and focus",
      icon: BookOpen,
      color: "#3DFDFF",
      xp: 200
    },
    {
      id: 104,
      title: "Goal Setting",
      description: "Setting realistic academic goals",
      icon: Award,
      color: "#F5DF4D",
      xp: 250
    }
  ],
  badges: [
    {
      id: 101,
      title: "Organized Learner",
      description: "Complete your first academic module",
      icon: BookOpen,
      color: "#FF8A48",
      condition: 1
    },
    {
      id: 102,
      title: "Study Master",
      description: "Complete all academic modules",
      icon: Award,
      color: "#3DFDFF",
      condition: 4
    }
  ]
};

// Self Awareness game configuration
export const selfAwarenessConfig = {
  title: "Self-Awareness Journey",
  titleIcon: Heart,
  titleColor: "#FC68B3",
  startingModuleId: 201,
  modules: [
    {
      id: 201,
      title: "Emotion Awareness",
      description: "Learn to recognize and name your emotions",
      icon: Heart,
      color: "#FC68B3",
      xp: 100
    },
    {
      id: 202,
      title: "Communication Skills",
      description: "Express your feelings effectively to others",
      icon: MessageCircle,
      color: "#3DFDFF",
      xp: 150
    },
    {
      id: 203,
      title: "Mindfulness Practice",
      description: "Stay present and aware of your thoughts",
      icon: Sparkles,
      color: "#FF8A48",
      xp: 200
    },
    {
      id: 204,
      title: "Self-Reflection",
      description: "Techniques for understanding your behavior",
      icon: Eye,
      color: "#F5DF4D",
      xp: 250
    },
    {
      id: 205,
      title: "Values Exploration",
      description: "Discover what matters most to you",
      icon: Lightbulb,
      color: "#2AC20E",
      xp: 300
    },
    {
      id: 206,
      title: "Personal Growth Plan",
      description: "Create roadmaps for emotional development",
      icon: Footprints,
      color: "#D5D5F1",
      xp: 350
    },
    {
      id: 207,
      title: "Perspective Taking",
      description: "Understanding different viewpoints",
      icon: Glasses,
      color: "#FF8A48",
      xp: 400
    },
    {
      id: 208,
      title: "Emotional Regulation",
      description: "Strategies to manage strong emotions",
      icon: Scale,
      color: "#FC68B3",
      xp: 450
    }
  ],
  badges: [
    {
      id: 201,
      title: "Emotional Explorer",
      description: "Complete your first self-awareness module",
      icon: Heart,
      color: "#FC68B3",
      condition: 1
    },
    {
      id: 202,
      title: "Mindfulness Guru",
      description: "Complete 4 self-awareness modules",
      icon: Sparkles,
      color: "#FF8A48",
      condition: 4
    },
    {
      id: 203,
      title: "Self-Awareness Master",
      description: "Complete all self-awareness modules",
      icon: Award,
      color: "#3DFDFF",
      condition: 8
    },
    {
      id: 204,
      title: "Growth Champion",
      description: "Earn 1000+ XP in self-awareness",
      icon: Trophy,
      color: "#2AC20E",
      condition: 6
    }
  ]
};

// Confidence Building game configuration
export const confidenceBuildingConfig = {
  title: "Confidence Building Challenge",
  titleIcon: Star,
  titleColor: "#F5DF4D",
  startingModuleId: 301,
  modules: [
    {
      id: 301,
      title: "Positive Self-Talk",
      description: "Develop a positive internal dialogue",
      icon: Star,
      color: "#F5DF4D",
      xp: 100
    },
    {
      id: 302,
      title: "Strengths Discovery",
      description: "Identify and build on your key strengths",
      icon: Medal,
      color: "#3DFDFF",
      xp: 150
    },
    {
      id: 303,
      title: "Goal Achievement",
      description: "Set and achieve confidence-building goals",
      icon: Sparkles,
      color: "#FC68B3",
      xp: 200
    },
    {
      id: 304,
      title: "Handling Criticism",
      description: "Learn to handle feedback constructively",
      icon: Award,
      color: "#FF8A48",
      xp: 250
    }
  ],
  badges: [
    {
      id: 301,
      title: "Self-Believer",
      description: "Complete your first confidence module",
      icon: Star,
      color: "#F5DF4D",
      condition: 1
    },
    {
      id: 302,
      title: "Confidence Champion",
      description: "Complete all confidence modules",
      icon: Award,
      color: "#FF8A48",
      condition: 4
    }
  ]
};

// Peer Pressure game configuration
export const peerPressureConfig = {
  title: "Peer Pressure Defense",
  titleIcon: Users,
  titleColor: "#2AC20E",
  startingModuleId: 401,
  modules: [
    {
      id: 401,
      title: "Recognizing Pressure",
      description: "Learn to identify peer pressure situations",
      icon: Users,
      color: "#2AC20E",
      xp: 100
    },
    {
      id: 402,
      title: "Resistance Techniques",
      description: "Strategies to say no effectively",
      icon: ShieldCheck,
      color: "#3DFDFF",
      xp: 150
    },
    {
      id: 403,
      title: "Building Boundaries",
      description: "Create healthy boundaries with friends",
      icon: PersonStanding,
      color: "#FC68B3",
      xp: 200
    },
    {
      id: 404,
      title: "Positive Influence",
      description: "Being a positive influence for others",
      icon: Award,
      color: "#F5DF4D",
      xp: 250
    }
  ],
  badges: [
    {
      id: 401,
      title: "Pressure Spotter",
      description: "Complete your first peer pressure module",
      icon: Users,
      color: "#2AC20E",
      condition: 1
    },
    {
      id: 402,
      title: "Social Master",
      description: "Complete all peer pressure modules",
      icon: Award,
      color: "#F5DF4D",
      condition: 4
    }
  ]
};

// Customizable game configuration template that can be used to create new games
export const createCustomGame = (config) => {
  const defaultConfig = {
    title: "Custom Game",
    titleIcon: Star,
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
  titleIcon: Cloud,
  titleColor: "#3DFDFF",
  startingModuleId: 501,
  modules: [
    {
      id: 501,
      title: "Stress Management",
      description: "Techniques to handle stress effectively",
      icon: Brain,
      color: "#3DFDFF",
      xp: 100
    },
    {
      id: 502,
      title: "Coping Strategies",
      description: "Healthy ways to deal with difficulties",
      icon: Shield,
      color: "#FC68B3",
      xp: 150
    }
  ],
  badges: [
    {
      id: 501,
      title: "Resilience Starter",
      description: "Complete your first resilience module",
      icon: Shield,
      color: "#3DFDFF",
      condition: 1
    }
  ]
});
