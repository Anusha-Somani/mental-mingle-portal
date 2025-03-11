
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import CategoryContent from "@/components/resources/CategoryContent";
import NeedCategories from "@/components/resources/NeedCategories";
import RecommendedContent from "@/components/resources/RecommendedContent";
import CategoryExplorer from "@/components/resources/CategoryExplorer";
import CalmingActivities from "@/components/resources/CalmingActivities";

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<{
    completedModules: number[];
    level: number;
  }>({
    completedModules: [],
    level: 1
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
        
        // Load user progress
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (!error && data) {
          setUserProgress({
            completedModules: data.completed_modules || [],
            level: data.level || 1
          });
        }
      }
    };
    
    checkUser();
  }, []);

  // Render selected category content
  const renderCategoryContent = () => {
    if (!selectedCategory) return null;
    
    return <CategoryContent category={selectedCategory} userId={userId} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3DFDFF]/10 to-[#FC68B3]/10">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <NeedCategories 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
          userId={userId} 
          userProgress={userProgress} 
        />

        {selectedCategory && (
          <div className="mb-12 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#1A1F2C]">
                {selectedCategory} Resources
              </h2>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCategory(null)}
              >
                Back to Categories
              </Button>
            </div>
            {renderCategoryContent()}
          </div>
        )}

        {!selectedCategory && (
          <>
            <RecommendedContent />
            <CategoryExplorer />
            <CalmingActivities />
          </>
        )}
      </main>
    </div>
  );
};

export default Resources;
