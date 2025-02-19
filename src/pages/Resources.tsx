
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileText, Video, Puzzle, Music, Heart, BookOpen, Timer } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";
import Wave from "@/components/Wave";

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const recommendedContent = [
    {
      title: "Managing Anxiety: Quick Tips",
      type: "VIDEO",
      duration: "2 MIN",
      views: "1.2k views",
      thumbnail: "public/lovable-uploads/7baf2020-67af-4825-9d09-9dc26bbc2423.png",
      category: "wellness"
    },
    {
      title: "Calming Puzzle Challenge",
      type: "GAME",
      duration: "5 MIN",
      views: "856 plays",
      thumbnail: "placeholder.svg",
      category: "games"
    },
    {
      title: "Meditation Music Playlist",
      type: "AUDIO",
      duration: "15 MIN",
      views: "2.3k plays",
      thumbnail: "placeholder.svg",
      category: "music"
    }
  ];

  const categories = [
    { icon: Video, label: "Videos", color: "#3DFDFF" },
    { icon: Puzzle, label: "Games", color: "#FC68B3" },
    { icon: Music, label: "Music", color: "#FF8A48" },
    { icon: BookOpen, label: "Articles", color: "#F5DF4D" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3DFDFF]/10 to-[#FC68B3]/10">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Mood-based recommendation */}
        <div className="mb-8">
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

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1A1F2C] mb-4">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedCategory(category.label)}
                className={`p-6 rounded-xl text-center transition-all ${
                  selectedCategory === category.label
                    ? 'bg-white shadow-lg scale-105'
                    : 'bg-white/50 hover:bg-white hover:shadow-md'
                }`}
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

        {/* Interactive Activities Section */}
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
      </main>
    </div>
  );
};

export default Resources;
