
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Timer } from "lucide-react";

interface ContentItem {
  title: string;
  type: string;
  duration: string;
  views: string;
  thumbnail: string;
  category: string;
}

const RecommendedContent = () => {
  const recommendedContent: ContentItem[] = [
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

  return (
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
  );
};

export default RecommendedContent;
