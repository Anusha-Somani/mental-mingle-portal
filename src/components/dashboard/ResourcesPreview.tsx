
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Puzzle, Music, Video } from "lucide-react";

const ResourcesPreview = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <Card className="bg-gradient-to-r from-[#E5DEFF] to-[#D3E4FD] p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#FC68B3]" />
            Discover Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#1A1F2C] mb-4">
            Explore our collection of calming activities, helpful videos, and interactive games designed to support your well-being journey.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <Puzzle className="w-8 h-8 mx-auto mb-2 text-[#FC68B3]" />
              <span className="text-sm">Puzzles</span>
            </div>
            <div className="text-center">
              <Music className="w-8 h-8 mx-auto mb-2 text-[#FF8A48]" />
              <span className="text-sm">Music</span>
            </div>
            <div className="text-center">
              <Video className="w-8 h-8 mx-auto mb-2 text-[#3DFDFF]" />
              <span className="text-sm">Videos</span>
            </div>
          </div>
          <Button
            onClick={() => navigate("/resources")}
            className="w-full bg-[#FC68B3] hover:bg-[#FC68B3]/80"
          >
            Explore Resources
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResourcesPreview;
