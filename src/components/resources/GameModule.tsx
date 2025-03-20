
import React, { useState } from "react";
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
  
  // We don't need to use these properties in this component yet,
  // but they're included in the props to fix TypeScript errors
  titleIcon,
  titleColor,
  modules,
  badges,
  startingModuleId
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  
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
  // This is where we'll add code later to render modules and badges
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold" style={{ color: titleColor || "#FF8A48" }}>
        {titleIcon && React.createElement(titleIcon, { className: "mr-2 inline h-6 w-6" })}
        {title}
      </h2>
      
      <div className="text-center text-gray-500">
        {modules && modules.length > 0 ? (
          <p>Game contains {modules.length} modules</p>
        ) : (
          <p>No modules found for this game</p>
        )}
      </div>
    </div>
  );
};

export default GameModule;
