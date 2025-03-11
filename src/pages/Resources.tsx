
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  FileText, 
  Video, 
  Puzzle, 
  Music, 
  Heart, 
  BookOpen, 
  Timer, 
  ShieldAlert, 
  Book, 
  MessageCircle, 
  Star, 
  Users,
  Trophy,
  CheckCircle2,
  Award
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import CategoryContent from "@/components/resources/CategoryContent";

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

  const recommendedContent = [
    {
      title: "Managing Anxiety: Quick Tips",
      type: "VIDEO",
      duration: "2 MIN",
      views: "1.2k views",
      thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
      category: "wellness"
    },
    {
      title: "Calming Puzzle Challenge",
      type: "GAME",
      duration: "5 MIN",
      views: "856 plays",
      thumbnail: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
      category: "games"
    },
    {
      title: "Meditation Music Playlist",
      type: "AUDIO",
      duration: "15 MIN",
      views: "2.3k plays",
      thumbnail: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&q=80",
      category: "music"
    }
  ];

  const categories = [
    { icon: Video, label: "Videos", color: "#3DFDFF" },
    { icon: Puzzle, label: "Games", color: "#FC68B3" },
    { icon: Music, label: "Music", color: "#FF8A48" },
    { icon: BookOpen, label: "Articles", color: "#F5DF4D" }
  ];

  const needCategories = [
    { 
      icon: ShieldAlert, 
      label: "Bullying", 
      color: "#3DFDFF", 
      description: "Get support for dealing with bullying situations",
      modules: [1, 2, 3, 4, 5] 
    },
    { 
      icon: Book, 
      label: "Academic Pressure", 
      color: "#FC68B3", 
      description: "Manage stress from school and studies",
      modules: [101, 102, 103, 104]
    },
    { 
      icon: MessageCircle, 
      label: "Self Awareness", 
      color: "#FF8A48", 
      description: "Learn to express and understand your feelings",
      modules: [201, 202, 203, 204]
    },
    { 
      icon: Star, 
      label: "Confidence Building", 
      color: "#F5DF4D", 
      description: "Develop self-esteem and believe in yourself",
      modules: [301, 302, 303, 304]
    },
    { 
      icon: Users, 
      label: "Peer Pressure", 
      color: "#2AC20E", 
      description: "Navigate social situations and make your own choices",
      modules: [401, 402, 403, 404]
    }
  ];

  // Check if category has completed modules
  const getCategoryProgress = (modules: number[]) => {
    const completedCount = modules.filter(id => 
      userProgress.completedModules.includes(id)
    ).length;
    
    return {
      completed: completedCount,
      total: modules.length,
      percentage: Math.round((completedCount / modules.length) * 100)
    };
  };

  // Render selected category content
  const renderCategoryContent = () => {
    if (!selectedCategory) return null;
    
    return <CategoryContent category={selectedCategory} userId={userId} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3DFDFF]/10 to-[#FC68B3]/10">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#1A1F2C] mb-6 text-center">
            What do you need help with today?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {needCategories.map((category, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedCategory(category.label)}
                className={`p-6 rounded-xl text-center transition-all flex flex-col items-center h-full ${
                  selectedCategory === category.label
                    ? 'bg-white shadow-lg scale-105'
                    : 'bg-white/50 hover:bg-white hover:shadow-md'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <category.icon 
                    className="w-8 h-8"
                    style={{ color: category.color }}
                  />
                </div>
                <span className="font-semibold text-[#1A1F2C] mb-2">
                  {category.label}
                </span>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                
                {userId && (
                  <div className="w-full mt-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>
                        {getCategoryProgress(category.modules).completed}/{getCategoryProgress(category.modules).total}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${getCategoryProgress(category.modules).percentage}%`,
                          backgroundColor: category.color 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

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
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-4">
              Recommended for you today
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedContent.map((content, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video">
                      <img 
                        src={content.thumbnail} 
                        alt={content.title}
                        className="object-cover w-full h-full"
                      />
                      {content.type === "VIDEO" && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Timer className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span className="font-medium">{content.type}</span>
                        <span>•</span>
                        <span>{content.duration}</span>
                      </div>
                      <h3 className="font-semibold text-[#1A1F2C] mb-1">{content.title}</h3>
                      <p className="text-sm text-gray-500">{content.views}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {!selectedCategory && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-4">
              Explore Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <motion.button
                  key={index}
                  className="p-6 rounded-xl text-center transition-all bg-white/50 hover:bg-white hover:shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <category.icon 
                    className="w-8 h-8 mx-auto mb-2"
                    style={{ color: category.color }}
                  />
                  <span className="font-medium text-[#1A1F2C]">
                    {category.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {!selectedCategory && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-4">
              Calming Activities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-[#3DFDFF]/20 to-[#FC68B3]/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Puzzle className="w-6 h-6 text-[#FC68B3]" />
                    Daily Puzzle Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Take a break with our daily mindfulness puzzle</p>
                  <Button 
                    className="w-full bg-[#FC68B3] hover:bg-[#FC68B3]/80"
                    onClick={() => window.location.href = '/puzzle'}
                  >
                    Start Puzzle
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-[#FF8A48]/20 to-[#F5DF4D]/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-6 h-6 text-[#FF8A48]" />
                    Calming Music
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Listen to curated playlists for relaxation</p>
                  <Button 
                    className="w-full bg-[#FF8A48] hover:bg-[#FF8A48]/80"
                  >
                    Play Music
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Resources;
