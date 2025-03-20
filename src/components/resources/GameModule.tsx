import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, ChevronLeft, ChevronRight, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EmotionalAwarenessActivity from "./activities/EmotionalAwarenessActivity";

interface GameModuleProps {
  userId: string | null;
  title: string;
  titleIcon: JSX.Element;
  titleColor: string;
  modules: {
    id: number;
    title: string;
    description: string;
    icon: JSX.Element;
    type: "video" | "activity" | "article";
    content?: string | JSX.Element;
    linkTo?: string;
  }[];
  badges: {
    id: number;
    title: string;
    description: string;
    icon: JSX.Element;
    requiredModules: number[];
  }[];
  startingModuleId?: number;
}

const GameModule: React.FC<GameModuleProps> = ({
  userId,
  title,
  titleIcon,
  titleColor,
  modules,
  badges,
  startingModuleId
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [view, setView] = useState<'grid' | 'module'>('grid');
  const [moduleId, setModuleId] = useState<number | null>(startingModuleId || null);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  
  useEffect(() => {
    const fetchCompletedModules = async () => {
      if (userId) {
        try {
          const { data, error } = await supabase
            .from('user_progress')
            .select('completed_modules')
            .eq('user_id', userId)
            .single();
            
          if (error) {
            console.error("Error fetching completed modules:", error);
            return;
          }
          
          if (data) {
            setCompletedModules(data.completed_modules || []);
          }
        } catch (error) {
          console.error("Error fetching completed modules:", error);
        }
      }
    };
    
    fetchCompletedModules();
  }, [userId]);
  
  useEffect(() => {
    if (moduleId) {
      setView('module');
    } else {
      setView('grid');
    }
  }, [moduleId]);
  
  const handleBackClick = () => {
    setModuleId(null);
    setView('grid');
  };

  const handleActivityClick = (moduleId: number) => {
    if (moduleId === 201) { // Emotion Awareness activity
      setIsActivityOpen(true);
    } else {
      // Handle other activity types
      const module = modules.find(m => m.id === moduleId);
      if (module?.linkTo) {
        navigate(module.linkTo);
      }
    }
  };
  
  const handleActivityClose = () => {
    setIsActivityOpen(false);
  };
  
  const currentModule = modules.find(module => module.id === moduleId);
  const hasAllRequiredModules = (badge: (typeof badges)[0]) => {
    return badge.requiredModules.every(moduleId => completedModules.includes(moduleId));
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {view === 'module' && currentModule && (
        <div className="mb-6">
          <Button onClick={handleBackClick} variant="ghost" className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to All Modules
          </Button>
          
          <h2 className="text-3xl font-bold text-center text-[#1A1F2C]">{currentModule.title}</h2>
          <p className="text-center text-gray-600 mt-2">{currentModule.description}</p>
        </div>
      )}
      
      {view === 'grid' && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full" style={{ backgroundColor: titleColor + '/10' }}>
              {titleIcon}
            </div>
            <h1 className="text-3xl font-bold text-[#1A1F2C]">{title}</h1>
          </div>
          
          <div>
            {/* Add any additional top-level actions here */}
          </div>
        </div>
      )}
      
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {modules.map((module) => (
            <Card 
              key={module.id}
              className="relative overflow-hidden transform hover:scale-105 transition-transform duration-200"
            >
              {completedModules.includes(module.id) && (
                <div className="absolute top-2 right-2 z-10">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
              )}
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-[#FC68B3]/10">{module.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">{module.title}</h3>
                <p className="text-sm text-gray-600 text-center mb-4">{module.description}</p>
                
                <div className="flex justify-center">
                  <Badge className="mb-2" variant="outline">
                    {module.type === 'video' ? '📹 Video' : 
                     module.type === 'activity' ? '🎮 Activity' : '📄 Article'}
                  </Badge>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={() => module.type === 'activity' 
                      ? handleActivityClick(module.id)
                      : setModuleId(module.id)}
                    className="rounded-full px-6 bg-[#FC68B3] hover:bg-[#FC68B3]/80"
                  >
                    {module.type === 'video' ? (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Watch
                      </>
                    ) : module.type === 'activity' ? (
                      'Start Activity'
                    ) : (
                      'Read Article'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {view === 'module' && currentModule && (
        <div className="mt-8">
          {currentModule.type === 'video' && typeof currentModule.content === 'string' && (
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={currentModule.content}
                title="Module Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          
          {currentModule.type === 'article' && typeof currentModule.content === 'string' && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentModule.content }} />
            </Card>
          )}
        </div>
      )}
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#1A1F2C] mb-4">Badges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <Card key={badge.id} className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2 rounded-full bg-[#F5DF4D]/20">{badge.icon}</div>
                  <h3 className="text-lg font-semibold">{badge.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">{badge.description}</p>
                
                {hasAllRequiredModules(badge) ? (
                  <Badge variant="outline" className="bg-green-500 text-white border-green-500">
                    <Award className="mr-2 h-4 w-4" />
                    Earned
                  </Badge>
                ) : (
                  <div className="text-sm text-gray-500">
                    Complete the required modules to earn this badge.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <EmotionalAwarenessActivity 
        isOpen={isActivityOpen} 
        onClose={handleActivityClose} 
        userId={userId} 
      />
    </div>
  );
};

export default GameModule;
