
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
// Remove incorrect import and use fabric directly in the component

interface EmotionColor {
  name: string;
  color: string;
}

const emotionColors: EmotionColor[] = [
  { name: "Angry", color: "#ea384c" },
  { name: "Happy", color: "#FEF7CD" },
  { name: "Sad", color: "#D3E4FD" },
  { name: "Surprised", color: "#E5DEFF" },
  { name: "Bad", color: "#FEC6A1" },
  { name: "Fearful", color: "#8E9196" },
  { name: "Disgusted", color: "#F2FCE2" },
];

interface FeelingsJarActivityProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeelingsJarActivity = ({ isOpen, onClose }: FeelingsJarActivityProps) => {
  const [step, setStep] = useState<"intro" | "drawing">("intro");
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<any>(null);
  const jarImageRef = useRef<HTMLImageElement | null>(null);

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
      import("fabric").then(({ Canvas, StaticCanvas, Image, Path, Rect }) => {
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
            "#000000";
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
          });
        } else {
          // If image didn't load, draw a simple jar outline
          const jar = new Rect({
            left: 100,
            top: 100,
            width: 200,
            height: 300,
            fill: 'transparent',
            stroke: '#000',
            strokeWidth: 2,
            rx: 20,
            ry: 20
          });
          canvas.add(jar);
          canvas.sendToBack(jar);
        }
        
        setFabricCanvas(canvas);
      });
    }
  }, [step, fabricCanvas, selectedEmotion]);

  // Update brush color when emotion changes
  useEffect(() => {
    if (fabricCanvas && fabricCanvas.freeDrawingBrush && selectedEmotion) {
      const emotionColor = emotionColors.find(e => e.name === selectedEmotion)?.color || "#000000";
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
    onClose();
    setStep("intro");
    setSelectedEmotion(null);
    setFabricCanvas(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Check-in with your feelings
          </DialogTitle>
          <DialogDescription className="text-lg">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center p-6 gap-6"
            >
              <div className="text-center space-y-4">
                <p className="text-lg">
                  Would you like to explore what you're feeling in more detail?
                </p>
                <p className="text-md text-muted-foreground">
                  This activity will help you visualize and understand your emotions.
                </p>
              </div>
              
              <Button 
                onClick={handleStartDrawing}
                className="bg-[#FF8A48] hover:bg-[#FF8A48]/90 text-white px-8 py-4 text-lg rounded-xl"
              >
                Start Activity
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="drawing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row gap-6 p-4"
            >
              <div className="w-full md:w-2/3 flex justify-center">
                <canvas ref={canvasRef} className="border-2 border-gray-200 rounded-lg shadow-md" />
              </div>
              
              <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Select a feeling:</h3>
                  <div className="flex flex-col gap-2">
                    {emotionColors.map((emotion) => (
                      <Button
                        key={emotion.name}
                        onClick={() => handleEmotionSelect(emotion.name)}
                        className={`w-full justify-start font-medium text-black ${
                          selectedEmotion === emotion.name ? "ring-2 ring-black" : ""
                        }`}
                        style={{ backgroundColor: emotion.color }}
                      >
                        {emotion.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button 
                    onClick={handleFinish}
                    className="w-full bg-[#3DFDFF] hover:bg-[#3DFDFF]/80 text-black font-semibold py-3 rounded-xl"
                  >
                    Finish
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default FeelingsJarActivity;
