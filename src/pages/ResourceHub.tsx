
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Video, SmilePlus, MessageCircle, BookOpen, Goal, Puzzle } from "lucide-react";
import Navigation from "@/components/Navigation";
import BackgroundWithEmojis from "@/components/BackgroundWithEmojis";

// Define the card data structure
interface ResourceCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  imageUrl?: string;
}

const ResourceHub = () => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState<string | null>(null);

  // Define all resource cards
  const resourceCards: ResourceCard[] = [
    {
      title: "Self-Help Videos",
      description: "Watch videos on mental wellness techniques and strategies",
      icon: <Video className="h-8 w-8 text-white" />,
      path: "/resources",
      color: "#FF8A48",
      imageUrl: "public/lovable-uploads/c4d2cc21-fec1-4a67-89c3-e206700841c0.png"
    },
    {
      title: "Mood Tracker",
      description: "Track and analyze your mood patterns",
      icon: <SmilePlus className="h-8 w-8 text-white" />,
      path: "/dashboard",
      color: "#3DFDFF"
    },
    {
      title: "Chat Support",
      description: "Get help and support through our AI companion",
      icon: <MessageCircle className="h-8 w-8 text-white" />,
      path: "/chat",
      color: "#FC68B3"
    },
    {
      title: "Journal",
      description: "Record your thoughts and feelings",
      icon: <BookOpen className="h-8 w-8 text-white" />,
      path: "/dashboard",
      color: "#F5DF4D"
    },
    {
      title: "Goals",
      description: "Set and track your wellness goals",
      icon: <Goal className="h-8 w-8 text-white" />,
      path: "/dashboard",
      color: "#3DFDFF"
    },
    {
      title: "Mind Games",
      description: "Play games designed to improve mental wellbeing",
      icon: <Puzzle className="h-8 w-8 text-white" />,
      path: "/puzzle",
      color: "#2AC20E"
    }
  ];

  return (
    <BackgroundWithEmojis>
      <Navigation />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1A1F2C] mb-4">M(in)dvincible Hub</h1>
          <p className="text-xl text-[#1A1F2C]/80 max-w-2xl mx-auto">
            Access all your mental wellness resources in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {resourceCards.map((card, index) => (
            <motion.div
              key={index}
              className="bg-white/90 backdrop-blur rounded-3xl overflow-hidden shadow-lg"
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHovering(card.title)}
              onHoverEnd={() => setIsHovering(null)}
              onClick={() => navigate(card.path)}
            >
              <div className="relative h-48 overflow-hidden">
                {card.imageUrl ? (
                  <img 
                    src={card.imageUrl} 
                    alt={card.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: card.color }}
                  >
                    <div className="p-4 rounded-full bg-white/20">
                      {card.icon}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-[#1A1F2C] mb-2">{card.title}</h3>
                <p className="text-[#1A1F2C]/70">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default ResourceHub;
