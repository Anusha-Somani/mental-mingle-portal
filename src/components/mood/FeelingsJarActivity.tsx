
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Smile, Heart, Cloud, Moon, Zap, X, Eye, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmotionColor {
  name: string;
  color: string;
  icon: React.ReactNode;
}

const emotions: EmotionColor[] = [
  { name: "Happy", color: "#F5DF4D", icon: <Smile className="w-5 h-5" /> },
  { name: "Angry", color: "#FF8A48", icon: <Flame className="w-5 h-5" /> },
  { name: "Sad", color: "#3DFDFF", icon: <Cloud className="w-5 h-5" /> },
  { name: "Fearful", color: "#D5D5F1", icon: <Eye className="w-5 h-5" /> },
  { name: "Surprised", color: "#2AC20E", icon: <Zap className="w-5 h-5" /> },
  { name: "Disgusted", color: "#D7FBA8", icon: <X className="w-5 h-5" /> },
  { name: "Love", color: "#FC68B3", icon: <Heart className="w-5 h-5" /> },
];

interface FeelingsJarActivityProps {
  onClose: () => void;
}

const FeelingsJarActivity: React.FC<FeelingsJarActivityProps> = ({ onClose }) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionColor | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 400 });
  const [emotionCounts, setEmotionCounts] = useState<Record<string, number>>({});
  
  // Jar path coordinates
  const jarPath = [
    "M 75 100",                       // Start at top left of jar neck
    "C 75 80, 225 80, 225 100",       // Top curve of jar opening
    "L 225 120",                      // Right side of jar neck
    "C 225 130, 235 140, 235 150",    // Right curve to jar shoulder
    "L 245 320",                      // Right side of jar body
    "C 245 350, 55 350, 55 320",      // Bottom curve of jar
    "L 65 150",                       // Left side of jar body
    "C 65 140, 75 130, 75 120",       // Left curve from jar neck
    "Z"                               // Close path
  ].join(" ");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      setCanvasContext(ctx);
      
      // Set the canvas size to match its display size
      setCanvasSize({
        width: canvas.clientWidth,
        height: canvas.clientHeight
      });
      
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      
      if (ctx) {
        // Draw the jar outline
        drawJarOutline(ctx);
      }
    }
  }, []);

  const drawJarOutline = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw jar path
    ctx.beginPath();
    const path = new Path2D(jarPath);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.stroke(path);
    
    // Create clipping path for the jar
    ctx.save();
  };

  const handleEmotionSelect = (emotion: EmotionColor) => {
    setSelectedEmotion(emotion);
    setEmotionCounts(prev => ({
      ...prev,
      [emotion.name.toLowerCase()]: (prev[emotion.name.toLowerCase()] || 0) + 1
    }));
    
    toast({
      title: `Selected: ${emotion.name}`,
      description: `Use the ${emotion.name.toLowerCase()} color to fill your jar.`,
      duration: 5000,
    });
    
    if (canvasContext) {
      canvasContext.strokeStyle = emotion.color;
      canvasContext.lineWidth = 15; // Thicker lines for coloring
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!selectedEmotion || !canvasContext) return;
    
    setIsDrawing(true);
    canvasContext.beginPath();
    
    // Get position for mouse or touch event
    const position = getEventPosition(e);
    canvasContext.moveTo(position.x, position.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasContext || !selectedEmotion) return;
    
    // Get position for mouse or touch event
    const position = getEventPosition(e);
    
    canvasContext.lineTo(position.x, position.y);
    canvasContext.stroke();
  };

  const stopDrawing = () => {
    if (canvasContext) {
      canvasContext.closePath();
    }
    setIsDrawing(false);
  };

  const getEventPosition = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    let x: number, y: number;
    
    if ('touches' in e) {
      // Touch event
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      const rect = canvas.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    return { x, y };
  };
  
  const saveJarActivity = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Not logged in",
          description: "You need to be logged in to save your feelings jar activity.",
          variant: "destructive"
        });
        return;
      }
      
      // Save the emotions drawn in the jar
      const canvas = canvasRef.current;
      if (canvas) {
        const jarImage = canvas.toDataURL('image/png');
        
        // Create a mapping of emotions used
        const emotionsUsed: Record<string, number> = {};
        emotions.forEach(emotion => {
          const name = emotion.name.toLowerCase();
          if (emotionCounts[name]) {
            emotionsUsed[name] = emotionCounts[name];
          }
        });
        
        // Save to journal_entries table
        const { error } = await supabase
          .from('journal_entries')
          .insert({
            user_id: session.user.id,
            prompt_text: "Feelings Jar Activity",
            entry_text: JSON.stringify({
              type: "feelings_jar",
              image: jarImage,
              emotions: emotionsUsed
            })
          });
          
        if (error) {
          console.error("Error saving jar activity:", error);
          toast({
            title: "Error saving activity",
            description: "There was a problem saving your feelings jar activity.",
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Activity saved!",
          description: "Your feelings jar activity has been saved to your journal.",
        });
      }
    } catch (err) {
      console.error("Error in save jar activity:", err);
      toast({
        title: "Error",
        description: "Failed to save your activity. Please try again.",
        variant: "destructive"
      });
    }
    
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card className="border-2 border-primary/30 bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-center text-[#1A1F2C]">
              Feelings Jar Activity
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <p className="text-center mb-6">
            Check-in with yourself to understand your feelings. Fill the jar with feelings colours
            to see how much of each feeling you have right now.
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {emotions.map((emotion) => (
              <Button
                key={emotion.name}
                onClick={() => handleEmotionSelect(emotion)}
                className="flex items-center gap-2 rounded-full px-4 py-2 transition-transform"
                style={{ 
                  backgroundColor: emotion.color,
                  color: "#1A1F2C",
                  transform: selectedEmotion?.name === emotion.name ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                {emotion.icon}
                {emotion.name}
              </Button>
            ))}
          </div>
          
          <div className="canvas-container w-full flex justify-center">
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="border border-gray-300 bg-white rounded-lg"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{ touchAction: 'none' }}
            />
          </div>
          
          {!selectedEmotion && (
            <p className="text-center mt-4 text-[#403E43]">
              Select an emotion color to start coloring the jar
            </p>
          )}
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={saveJarActivity}
              className="bg-primary hover:bg-primary/80 text-[#1A1F2C] rounded-full font-medium"
            >
              Complete Activity
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeelingsJarActivity;
