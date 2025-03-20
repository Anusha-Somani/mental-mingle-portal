
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
  { name: "Angry", color: "#FF8A48" },
  { name: "Happy", color: "#F5DF4D" },
  { name: "Sad", color: "#D5D5F1" },
  { name: "Surprised", color: "#3DFDFF" },
  { name: "Bad", color: "#FC68B3" },
  { name: "Fearful", color: "#8E9196" },
  { name: "Disgusted", color: "#2AC20E" },
];

// Mason jar SVG path - more accurate representation of a jar with threads at the top
const jarSvgPath = `
  M 150,100
  C 150,100 130,100 130,120
  L 130,140
  C 130,150 120,150 120,160
  L 120,170
  C 120,180 130,180 130,190
  L 130,400
  C 130,450 270,450 270,400
  L 270,190
  C 270,180 280,180 280,170
  L 280,160
  C 280,150 270,150 270,140
  L 270,120
  C 270,100 250,100 250,100
  Z
`;

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
  const [jarPath, setJarPath] = useState<any>(null);
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

  useEffect(() => {
    if (isOpen) {
      // Reset the states when dialog opens
      setStep("intro");
      setSelectedEmotion(null);
      setFabricCanvas(null);
    }
  }, [isOpen]);

  // Initialize canvas when step changes to drawing
  useEffect(() => {
    if (step === "drawing" && canvasRef.current && !fabricCanvas) {
      console.log("Initializing canvas for drawing");
      
      // Dynamically import fabric.js
      import("fabric").then((fabric) => {
        console.log("Fabric.js loaded successfully");
        
        // Create a new fabric canvas
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: 400,
          height: 500,
          backgroundColor: "#ffffff",
          isDrawingMode: true,
        });
        
        console.log("Canvas created:", canvas);
        
        // Set drawing brush properties
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.width = 18;
          canvas.freeDrawingBrush.color = emotionColors[0].color;
          console.log("Free drawing brush configured");
        }
        
        // Add jar outline
        const jar = new fabric.Path(jarSvgPath, {
          fill: 'rgba(255, 255, 255, 0.01)',
          stroke: '#000000',
          strokeWidth: 3,
          strokeLineCap: 'round',
          strokeLineJoin: 'round',
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
          opacity: 1
        });
        
        console.log("Jar path created:", jar);
        canvas.add(jar);
        canvas.renderAll();
        
        setJarPath(jar);
        setFabricCanvas(canvas);
        
        toast({
          title: "Your feeling jar is ready!",
          description: "Select a feeling and use your cursor to color inside the jar.",
          className: "bg-gradient-to-r from-[#3DFDFF] to-[#FF8A48]/80 text-black",
        });
      }).catch(err => {
        console.error("Error loading Fabric.js:", err);
        toast({
          title: "Oops! Something went wrong",
          description: "We couldn't load the drawing tool. Please try again later.",
          variant: "destructive",
        });
      });
    }
  }, [step, fabricCanvas, toast]);

  // Update brush color when emotion changes
  useEffect(() => {
    if (fabricCanvas && fabricCanvas.freeDrawingBrush && selectedEmotion) {
      console.log("Updating brush color for emotion:", selectedEmotion);
      const emotionColor = emotionColors.find(e => e.name === selectedEmotion)?.color || "#FF8A48";
      fabricCanvas.freeDrawingBrush.color = emotionColor;
      
      toast({
        title: `${selectedEmotion} selected!`,
        description: `Now color inside the jar with this feeling using your cursor.`,
        className: `bg-gradient-to-r from-white to-[${emotionColor}] text-black`,
      });
    }
  }, [selectedEmotion, fabricCanvas, toast]);

  const handleEmotionSelect = (emotion: string) => {
    console.log("Emotion selected:", emotion);
    setSelectedEmotion(emotion);
    
    // Play a bubble sound when changing emotions
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error("Audio play error:", err));
    }
  };

  const handleStartDrawing = () => {
    console.log("Starting drawing activity");
    setStep("drawing");
  };

  const handleFinish = () => {
    console.log("Finishing activity");
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
                  <canvas 
                    ref={canvasRef} 
                    className="border-2 border-[#3DFDFF]/30 rounded-lg shadow-[0_5px_15px_rgba(61,253,255,0.2)]" 
                  />
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
                    <div className="grid grid-cols-2 gap-2">
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
