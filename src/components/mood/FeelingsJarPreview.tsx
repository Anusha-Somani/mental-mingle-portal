
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FeelingsJarPreviewProps {
  onShowFullJar: () => void;
}

interface EmotionData {
  emotion: string;
  color: string;
  count: number;
}

const emotionColors = {
  "happy": "#F5DF4D",
  "excited": "#F5DF4D",
  "neutral": "#D5D5F1",
  "angry": "#FF8A48",
  "sad": "#3DFDFF",
  "fearful": "#D5D5F1",
  "surprised": "#2AC20E",
  "disgusted": "#D7FBA8", 
  "love": "#FC68B3"
};

const FeelingsJarPreview: React.FC<FeelingsJarPreviewProps> = ({ onShowFullJar }) => {
  const [emotions, setEmotions] = useState<EmotionData[]>([]);
  
  useEffect(() => {
    const fetchEmotions = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) return;
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('mood_entries')
        .select('emoji_type')
        .eq('user_id', session.user.id)
        .gte('created_at', oneWeekAgo.toISOString())
        .order('created_at', { ascending: false });
      
      if (error || !data) {
        console.error("Error fetching emotions:", error);
        return;
      }
      
      // Count the occurrences of each emotion
      const emotionCounts: Record<string, number> = {};
      data.forEach(entry => {
        const emotion = entry.emoji_type;
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
      
      // Convert to array of objects with color information
      const emotionsArray = Object.entries(emotionCounts).map(([emotion, count]) => ({
        emotion,
        color: emotionColors[emotion as keyof typeof emotionColors] || "#D5D5F1",
        count
      }));
      
      setEmotions(emotionsArray);
    };
    
    fetchEmotions();
  }, []);
  
  // Calculate total emotions to normalize for jar height
  const totalEmotions = emotions.reduce((sum, e) => sum + e.count, 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <Card className="overflow-hidden border-2 border-[#D5D5F1]/50 shadow-md p-2">
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-medium mb-1">My Feelings Jar</h3>
          
          <div className="relative w-20 h-24 my-1">
            {/* Jar SVG with dynamic emotion layers */}
            <svg viewBox="0 0 300 400" className="w-full h-full">
              {/* Jar outline */}
              <path
                d="M 75 100 C 75 80, 225 80, 225 100 L 225 120 C 225 130, 235 140, 235 150 L 245 320 C 245 350, 55 350, 55 320 L 65 150 C 65 140, 75 130, 75 120 Z"
                fill="white"
                stroke="#000"
                strokeWidth="3"
              />
              
              {/* Dynamic emotion layers */}
              {emotions.length > 0 ? (
                emotions.map((emotion, index, array) => {
                  // Calculate height and position for each emotion
                  const totalHeight = 180; // Space for emotions in jar
                  const startY = 350 - totalHeight; // Starting Y position
                  
                  // Calculate proportional heights
                  let accumulatedHeight = 0;
                  const heights: number[] = [];
                  
                  for (let i = 0; i < array.length; i++) {
                    const height = (array[i].count / totalEmotions) * totalHeight;
                    heights.push(height);
                    if (i < index) accumulatedHeight += height;
                  }
                  
                  const y = startY + accumulatedHeight;
                  
                  return (
                    <rect 
                      key={emotion.emotion}
                      x="65" 
                      y={y}
                      width="180" 
                      height={heights[index]}
                      fill={emotion.color}
                    />
                  );
                })
              ) : (
                // Empty jar layers for display when no data
                <>
                  <rect x="65" y="310" width="180" height="40" fill="#D5D5F1" opacity="0.3" />
                  <rect x="65" y="270" width="180" height="40" fill="#D5D5F1" opacity="0.2" />
                </>
              )}
            </svg>
          </div>
          
          <button 
            onClick={onShowFullJar}
            className="text-xs flex items-center gap-1 mt-1 text-[#1A1F2C]/80 hover:text-[#FC68B3] transition-colors"
          >
            <Eye className="w-3 h-3" />
            View Details
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

export default FeelingsJarPreview;
