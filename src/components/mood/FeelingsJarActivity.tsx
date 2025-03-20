
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SparklesIcon, HeartIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmotionColor {
  name: string;
  color: string;
}

const emotionColors: EmotionColor[] = [
  { name: "Angry", color: "#FF8A48" }, // Orange from app colors
  { name: "Happy", color: "#F5DF4D" }, // Yellow from app colors
  { name: "Sad", color: "#D5D5F1" },   // Light purple from app colors
  { name: "Surprised", color: "#3DFDFF" }, // Cyan from app colors
  { name: "Bad", color: "#FC68B3" },   // Pink from app colors
  { name: "Fearful", color: "#8E9196" }, // Neutral gray
  { name: "Disgusted", color: "#2AC20E" }, // Green from app colors
];

interface FeelingsJarActivityProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeelingsJarActivity = ({ isOpen, onClose }: FeelingsJarActivityProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"intro" | "drawing">("intro");
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<any>(null);
  const jarImageRef = useRef<HTMLImageElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create bubble sound effect
  useEffect(() => {
    const audio = new Audio();
    audio.src = "data:audio/wav;base64,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";
    audioRef.current = audio;
  }, []);

  // Play sound when dialog opens
  useEffect(() => {
    if (isOpen && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error("Audio play error:", err));
    }
  }, [isOpen]);

  // Load jar image on component mount
  useEffect(() => {
    const jarImg = new Image();
    jarImg.src = "/lovable-uploads/1975e958-a25c-4716-a2a6-0351febe3277.png";
    jarImg.onload = () => {
      jarImageRef.current = jarImg;
    };
  }, []);

  // Initialize canvas when step changes to drawing
  useEffect(() => {
    if (step === "drawing" && canvasRef.current && !fabricCanvas) {
      // We're using fabric.js directly here instead of fabric/react to avoid compatibility issues
      import("fabric").then(({ Canvas, Image, Path }) => {
        const canvas = new Canvas(canvasRef.current, {
          width: 400,
          height: 500,
          backgroundColor: "#ffffff",
          isDrawingMode: true,
        });
        
        // Set drawing brush
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.width = 15;
          canvas.freeDrawingBrush.color = selectedEmotion ? 
            emotionColors.find(e => e.name === selectedEmotion)?.color || "#000000" : 
            "#FF8A48"; // Default to app orange
        }
        
        // Add jar outline as background
        if (jarImageRef.current) {
          Image.fromURL(jarImageRef.current.src, (img) => {
            img.scaleToWidth(canvas.width * 0.8);
            img.set({
              left: canvas.width / 2 - (img.width || 0) * (img.scaleX || 1) / 2,
              top: canvas.height / 2 - (img.height || 0) * (img.scaleY || 1) / 2,
              selectable: false,
              evented: false,
            });
            canvas.add(img);
            canvas.sendToBack(img);
            canvas.renderAll();
            
            // Notification toast when jar is ready
            toast({
              title: "Your feeling jar is ready!",
              description: "Use different colors to express how much of each feeling you have.",
              className: "bg-gradient-to-r from-[#3DFDFF] to-[#FF8A48]/80 text-black",
            });
          });
        }
        
        setFabricCanvas(canvas);
      });
    }
  }, [step, fabricCanvas, selectedEmotion, toast]);

  // Update brush color when emotion changes
  useEffect(() => {
    if (fabricCanvas && fabricCanvas.freeDrawingBrush && selectedEmotion) {
      const emotionColor = emotionColors.find(e => e.name === selectedEmotion)?.color || "#FF8A48";
      fabricCanvas.freeDrawingBrush.color = emotionColor;
    }
  }, [selectedEmotion, fabricCanvas]);

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
  };

  const handleStartDrawing = () => {
    setStep("drawing");
  };

  const handleFinish = () => {
    // Here you could save the canvas image or do something with it
    toast({
      title: "Great job! 🎉",
      description: "Your feelings have been captured in the jar.",
      className: "bg-gradient-to-r from-[#FC68B3] to-[#F5DF4D] text-black",
    });
    onClose();
    setStep("intro");
    setSelectedEmotion(null);
    setFabricCanvas(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl bg-gradient-to-br from-[#D5D5F1]/90 via-white/90 to-[#3DFDFF]/50 backdrop-blur-md rounded-2xl border border-[#FF8A48]/30 shadow-[0_0_20px_rgba(252,104,179,0.2)]">
        <DialogHeader className="pb-4 border-b border-[#FC68B3]/20">
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A48] to-[#FC68B3]">
            Check-in with your feelings
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-700">
            {step === "intro" ? (
              "Emotions can be tough to navigate, let us support you in this journey!"
            ) : (
              "Fill the jar with feelings colours to see how much of each feeling you have right now."
            )}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === "intro" ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="flex flex-col items-center justify-center p-6 gap-6"
            >
              <motion.div 
                className="text-center space-y-4 max-w-md"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-lg text-gray-800">
                  Would you like to explore what you're feeling in more detail?
                </p>
                <p className="text-md text-gray-600">
                  This activity will help you visualize and understand your emotions.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button 
                  onClick={handleStartDrawing}
                  className="bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] hover:from-[#FF8A48]/90 hover:to-[#FC68B3]/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg"
                >
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Start Activity
                </Button>
                <motion.div
                  className="absolute -z-10 inset-0 bg-gradient-to-r from-[#FF8A48]/20 to-[#FC68B3]/20 rounded-xl blur-xl"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.7, 0.9, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="drawing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col md:flex-row gap-6 p-4"
            >
              <div className="w-full md:w-2/3 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <canvas ref={canvasRef} className="border-2 border-[#3DFDFF]/30 rounded-lg shadow-[0_5px_15px_rgba(61,253,255,0.2)]" />
                  <motion.div
                    className="absolute -z-10 inset-0 bg-white/50 rounded-lg blur-xl"
                    animate={{ opacity: [0.5, 0.7, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
              </div>
              
              <div className="w-full md:w-1/3 flex flex-col gap-4">
                <motion.div 
                  className="bg-white/50 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="bg-gradient-to-r from-[#FF8A48]/80 to-[#FC68B3]/80 p-3 text-white">
                    <h3 className="text-lg font-semibold flex items-center">
                      <HeartIcon className="w-5 h-5 mr-2" />
                      Select a feeling:
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {emotionColors.map((emotion) => (
                        <motion.button
                          key={emotion.name}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleEmotionSelect(emotion.name)}
                          className={`w-full py-3 px-4 rounded-lg font-medium text-black transition-all ${
                            selectedEmotion === emotion.name 
                              ? "ring-2 ring-black shadow-lg" 
                              : "shadow"
                          }`}
                          style={{ backgroundColor: emotion.color }}
                        >
                          {emotion.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mt-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button 
                    onClick={handleFinish}
                    className="w-full bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] hover:from-[#3DFDFF]/90 hover:to-[#2AC20E]/90 text-black font-semibold py-3 rounded-xl shadow-lg"
                  >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Complete Activity
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default FeelingsJarActivity;
