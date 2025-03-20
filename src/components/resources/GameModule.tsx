
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import EmotionalAwarenessActivity from "./activities/EmotionalAwarenessActivity";
import { LucideIcon } from "lucide-react";

// Define types for modules and badges
interface ModuleType {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  xp: number;
}

interface BadgeType {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  condition: number;
}

// Update the GameModuleProps interface to include all properties used by game components
interface GameModuleProps {
  title: string;
  description?: string;
  moduleId?: number;
  category?: string;
  level?: number;
  xpReward?: number;
  userId: string | null;
  isCompleted?: boolean;
  onComplete?: () => void;
  
  // Add the missing properties
  titleIcon?: LucideIcon;
  titleColor?: string;
  modules?: ModuleType[];
  badges?: BadgeType[];
  startingModuleId?: number;
}

const GameModule: React.FC<GameModuleProps> = ({
  title,
  description,
  moduleId,
  category,
  level,
  xpReward,
  userId,
  isCompleted,
  onComplete,
  
  titleIcon,
  titleColor,
  modules,
  badges,
  startingModuleId
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [userCompletedModules, setUserCompletedModules] = useState<number[]>([]);
  
  useEffect(() => {
    // Load user progress only when userId is available
    if (userId) {
      const fetchUserProgress = async () => {
        const { data } = await supabase
          .from('user_progress')
          .select('completed_modules')
          .eq('user_id', userId)
          .single();
          
        if (data && data.completed_modules) {
          setUserCompletedModules(data.completed_modules);
        }
      };
      
      fetchUserProgress();
    }
  }, [userId]);
  
  const handleClick = async () => {
    // For the Emotional Awareness module, open the activity dialog
    if (moduleId === 201) {
      setIsActivityOpen(true);
      return;
    }
    
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to complete this module",
        variant: "destructive"
      });
      return;
    }
    
    if (isCompleted) {
      toast({
        title: "Already completed",
        description: "You have already completed this module"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Get current progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('completed_modules, xp')
        .eq('user_id', userId)
        .single();
      
      if (progressData) {
        const completedModules = progressData.completed_modules || [];
        const updatedModules = [...completedModules, moduleId];
        const updatedXP = (progressData.xp || 0) + (xpReward || 0);
        
        // Update user_progress
        await supabase
          .from('user_progress')
          .upsert({
            user_id: userId,
            completed_modules: updatedModules,
            xp: updatedXP
          });
        
        toast({
          title: "Module completed!",
          description: `You earned ${xpReward} XP!`
        });
        
        if (onComplete) onComplete();
        
        // Update local state
        setUserCompletedModules(updatedModules);
      }
    } catch (error) {
      console.error("Error completing module:", error);
      toast({
        title: "Error",
        description: "Failed to complete the module",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleActivityClose = () => {
    setIsActivityOpen(false);
    if (onComplete) onComplete(); // Refresh parent component
  };
  
  // Handle the case when only module information is provided (single module view)
  if (description && moduleId) {
    return (
      <>
        <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${isCompleted ? 'border-green-400' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {title}
                  {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              </div>
              <div className="flex items-center gap-1 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md">
                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                <span>{xpReward} XP</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
                  {category}
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-md">
                  Level {level}
                </span>
              </div>
              <Button 
                onClick={handleClick}
                disabled={loading}
                size="sm"
                variant={isCompleted ? "outline" : "default"}
                className={isCompleted ? "text-green-600 border-green-600" : ""}
              >
                {loading ? "Loading..." : isCompleted ? "Completed" : "Start"}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {moduleId === 201 && (
          <EmotionalAwarenessActivity 
            isOpen={isActivityOpen} 
            onClose={handleActivityClose} 
            userId={userId} 
          />
        )}
      </>
    );
  } 
  
  // If modules are provided, this is the full game view (multiple modules)
  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold flex items-center" style={{ color: titleColor || "#FF8A48" }}>
        {titleIcon && React.createElement(titleIcon, { className: "mr-2 inline h-6 w-6" })}
        {title}
      </h2>
      
      {modules && modules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {modules.map((module) => {
            const isModuleCompleted = userCompletedModules.includes(module.id);
            
            return (
              <Card 
                key={module.id} 
                className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${isModuleCompleted ? 'border-green-400' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                          style={{ backgroundColor: module.color || "#FC68B3", color: "#FFFFFF" }}
                        >
                          {React.createElement(module.icon, { className: "h-4 w-4" })}
                        </div>
                        <h3 className="text-base font-semibold flex items-center gap-1">
                          {module.title}
                          {isModuleCompleted && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 ml-10">{module.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span>{module.xp} XP</span>
                    </div>
                  </div>
                  
                  <div className="ml-10 mt-2">
                    <Button 
                      onClick={() => {
                        // For module 201, we open the activity dialog
                        if (module.id === 201) {
                          setIsActivityOpen(true);
                          return;
                        }
                        
                        // For other modules, handle completion directly
                        if (!isModuleCompleted) {
                          // Temporarily set moduleId to handle completion
                          const currentModuleId = moduleId;
                          moduleId = module.id;
                          xpReward = module.xp;
                          handleClick();
                          // Restore original moduleId
                          moduleId = currentModuleId;
                        }
                      }}
                      size="sm"
                      variant={isModuleCompleted ? "outline" : "default"}
                      className={`text-xs px-3 py-1 h-auto ${isModuleCompleted ? "text-green-600 border-green-600" : ""}`}
                    >
                      {isModuleCompleted ? "Completed" : "Start"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p>No modules found for this game</p>
        </div>
      )}
      
      {badges && badges.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Badges to Earn</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badges.map((badge) => {
              // Check if user has completed enough modules to earn this badge
              const requiredModuleCount = badge.condition;
              const completedCount = userCompletedModules.length;
              const isBadgeEarned = completedCount >= requiredModuleCount;
              
              return (
                <Card 
                  key={badge.id} 
                  className={`text-center p-4 ${isBadgeEarned ? 'border-green-400' : 'opacity-80'}`}
                >
                  <div 
                    className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${isBadgeEarned ? '' : 'grayscale'}`}
                    style={{ backgroundColor: badge.color || "#FC68B3", color: "#FFFFFF" }}
                  >
                    {React.createElement(badge.icon, { className: "h-6 w-6" })}
                  </div>
                  <h4 className="font-semibold text-sm">{badge.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                  
                  {!isBadgeEarned && (
                    <div className="text-xs text-gray-500 mt-2">
                      Complete {requiredModuleCount - completedCount} more modules
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}
      
      {moduleId === 201 && (
        <EmotionalAwarenessActivity 
          isOpen={isActivityOpen} 
          onClose={handleActivityClose} 
          userId={userId} 
        />
      )}
    </div>
  );
};

export default GameModule;
