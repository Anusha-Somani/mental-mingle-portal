
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Award, 
  Trophy, 
  Shield, 
  Users, 
  MessageCircle, 
  CheckCircle, 
  ArrowRight,
  BookOpen,
  Heart,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BullyingGameModuleProps {
  userId: string | null;
}

interface GameModule {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  xp: number;
  completed?: boolean;
  locked?: boolean;
}

interface BadgeType {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  condition: number; // number of modules to complete to earn this badge
  earned?: boolean;
}

const BullyingGameModule: React.FC<BullyingGameModuleProps> = ({ userId }) => {
  const [userProgress, setUserProgress] = useState<{ 
    completedModules: number[];
    xp: number;
    level: number;
  }>({
    completedModules: [],
    xp: 0,
    level: 1
  });

  const [activeTab, setActiveTab] = useState<'journey' | 'badges'>('journey');
  const { toast } = useToast();

  // Define game modules
  const modules: GameModule[] = [
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
  ];

  // Define badges
  const badges: BadgeType[] = [
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
  ];

  // Calculate XP needed for next level
  const getXpForNextLevel = (level: number) => {
    return level * 500;
  };

  // Calculate progress percentage towards next level
  const getLevelProgress = () => {
    const xpForNextLevel = getXpForNextLevel(userProgress.level);
    const xpInCurrentLevel = userProgress.xp % xpForNextLevel;
    return Math.floor((xpInCurrentLevel / xpForNextLevel) * 100);
  };

  // Load user progress
  useEffect(() => {
    const loadUserProgress = async () => {
      if (!userId) return;
      
      try {
        // Fetch user progress from Supabase
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (error) {
          console.error("Error fetching progress:", error);
          return;
        }
        
        if (data) {
          setUserProgress({
            completedModules: data.completed_modules || [],
            xp: data.xp || 0,
            level: data.level || 1
          });
        }
      } catch (error) {
        console.error("Failed to load progress:", error);
      }
    };
    
    loadUserProgress();
  }, [userId]);

  // Update modules with completion status
  const getModulesWithStatus = () => {
    return modules.map(module => ({
      ...module,
      completed: userProgress.completedModules.includes(module.id),
      locked: module.id > 1 && !userProgress.completedModules.includes(module.id - 1)
    }));
  };

  // Update badges with earned status
  const getBadgesWithStatus = () => {
    return badges.map(badge => ({
      ...badge,
      earned: userProgress.completedModules.length >= badge.condition
    }));
  };

  // Handle module completion
  const completeModule = async (moduleId: number) => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to track your progress",
        variant: "destructive"
      });
      return;
    }
    
    if (userProgress.completedModules.includes(moduleId)) {
      toast({
        title: "Already completed",
        description: "You've already completed this module",
      });
      return;
    }
    
    // Get the module to complete
    const moduleToComplete = modules.find(m => m.id === moduleId);
    if (!moduleToComplete) return;
    
    // Update local state
    const updatedCompletedModules = [...userProgress.completedModules, moduleId];
    const updatedXP = userProgress.xp + moduleToComplete.xp;
    
    // Calculate new level
    const xpForNextLevel = getXpForNextLevel(userProgress.level);
    let newLevel = userProgress.level;
    if (updatedXP >= userProgress.level * xpForNextLevel) {
      newLevel = Math.floor(updatedXP / xpForNextLevel) + 1;
      
      toast({
        title: "Level Up!",
        description: `Congratulations! You've reached level ${newLevel}`,
        variant: "default"
      });
    }
    
    // Check for new badges
    const updatedBadges = getBadgesWithStatus();
    const newBadges = updatedBadges.filter(b => 
      b.earned && 
      b.condition <= updatedCompletedModules.length && 
      b.condition > userProgress.completedModules.length
    );
    
    if (newBadges.length > 0) {
      newBadges.forEach(badge => {
        toast({
          title: "New Badge Earned!",
          description: `You've earned the ${badge.title} badge`,
          variant: "default"
        });
      });
    }
    
    const updatedProgress = {
      completedModules: updatedCompletedModules,
      xp: updatedXP,
      level: newLevel
    };
    
    setUserProgress(updatedProgress);
    
    // Save to database
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          completed_modules: updatedCompletedModules,
          xp: updatedXP,
          level: newLevel
        });
      
      if (error) throw error;
      
      toast({
        title: "Progress Saved",
        description: `You've earned ${moduleToComplete.xp} XP!`,
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
      toast({
        title: "Error",
        description: "Failed to save your progress",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#1A1F2C] flex items-center gap-2">
        <Shield className="text-[#3DFDFF]" />
        Bullying Response Training
      </h2>
      
      {/* User Progress Bar */}
      <div className="mb-8 p-4 bg-[#3DFDFF]/10 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Level {userProgress.level}</span>
          <span className="text-sm">{userProgress.xp} XP</span>
        </div>
        <Progress value={getLevelProgress()} className="h-2 bg-gray-200" />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">Current</span>
          <span className="text-xs text-gray-500">
            Next Level: {getXpForNextLevel(userProgress.level)} XP
          </span>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'journey' ? 'text-[#3DFDFF] border-b-2 border-[#3DFDFF]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('journey')}
        >
          Learning Journey
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'badges' ? 'text-[#FC68B3] border-b-2 border-[#FC68B3]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('badges')}
        >
          Badges ({getBadgesWithStatus().filter(b => b.earned).length}/{badges.length})
        </button>
      </div>
      
      {/* Learning Journey */}
      {activeTab === 'journey' && (
        <div className="space-y-4">
          {getModulesWithStatus().map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-l-4 ${module.locked ? 'opacity-50' : ''}`} style={{ borderLeftColor: module.color }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mt-1"
                        style={{ backgroundColor: `${module.color}20` }}
                      >
                        <module.icon className="w-5 h-5" style={{ color: module.color }} />
                      </div>
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          {module.title}
                          {module.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </h3>
                        <p className="text-sm text-gray-600">{module.description}</p>
                        <div className="text-xs text-gray-500 mt-1">+{module.xp} XP</div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="mt-2"
                      disabled={module.locked || module.completed}
                      onClick={() => completeModule(module.id)}
                      style={{ backgroundColor: module.color }}
                    >
                      {module.completed ? "Completed" : "Start"}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Badges */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getBadgesWithStatus().map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex-1"
            >
              <Card className={`h-full ${!badge.earned ? 'opacity-50' : ''}`}>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-3 mt-4"
                    style={{ backgroundColor: badge.earned ? badge.color : '#f1f1f1' }}
                  >
                    <badge.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-medium">{badge.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                  <div className="text-xs mt-auto">
                    {badge.earned ? 
                      <span className="text-green-500 font-medium">Earned!</span> : 
                      <span className="text-gray-500">
                        {userProgress.completedModules.length}/{badge.condition} modules
                      </span>
                    }
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Sign-in prompt for non-authenticated users */}
      {!userId && (
        <div className="mt-8 p-4 bg-[#F5DF4D]/20 rounded-lg text-center">
          <p className="mb-2">Sign in to save your progress and earn badges!</p>
          <Button 
            onClick={() => window.location.href = '/auth'}
            className="bg-[#F5DF4D] hover:bg-[#F5DF4D]/80 text-black"
          >
            Sign In
          </Button>
        </div>
      )}
    </div>
  );
};

export default BullyingGameModule;
