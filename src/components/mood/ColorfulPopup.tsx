
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FeelingsJarActivity from "./FeelingsJarActivity";
import NextStepsPopup from "./NextStepsPopup";

interface ColorfulPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const ColorfulPopup: React.FC<ColorfulPopupProps> = ({ isOpen, onClose, onComplete }) => {
  const [showActivity, setShowActivity] = useState(false);
  const [showNextSteps, setShowNextSteps] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for bubble sound
    const bubbleSound = new Audio("/bubble-pop.mp3");
    setAudio(bubbleSound);

    // Play sound when popup opens
    if (isOpen && audio) {
      audio.play().catch(e => console.log("Audio play failed:", e));
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [isOpen]);

  const handleStartActivity = () => {
    setShowActivity(true);
  };

  const handleCompleteActivity = () => {
    setShowActivity(false);
    setShowNextSteps(true);
    
    // If onComplete callback is provided, call it to update jar preview on dashboard
    if (onComplete) {
      onComplete();
    }
  };
  
  const handleCloseAll = () => {
    setShowActivity(false);
    setShowNextSteps(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="border-none shadow-none p-0 bg-transparent">
          <AnimatePresence mode="wait">
            {!showActivity ? (
              <motion.div
                key="popup"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 25 
                }}
                className="rounded-3xl overflow-hidden"
              >
                <div className="bg-gradient-to-br from-[#FF8A48] via-[#FC68B3] to-[#3DFDFF] p-1 rounded-3xl">
                  <div className="bg-white/95 rounded-3xl p-8 backdrop-blur-sm">
                    <div className="text-center space-y-4">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex justify-center"
                      >
                        <div className="w-20 h-20 rounded-full bg-[#D5D5F1] flex items-center justify-center">
                          <span className="text-4xl">🫧</span>
                        </div>
                      </motion.div>
                      
                      <motion.h2 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-2xl font-bold text-[#1A1F2C]"
                      >
                        Emotions can be tough to navigate
                      </motion.h2>
                      
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="text-[#403E43]"
                      >
                        Let us support you in this journey! Would you like to try an activity to help process your feelings?
                      </motion.p>
                      
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        <Button 
                          onClick={handleStartActivity}
                          className="mt-4 bg-[#FF8A48] hover:bg-[#FF8A48]/80 text-white font-medium rounded-full px-8 py-2"
                        >
                          Start Activity
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="activity"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <FeelingsJarActivity onClose={handleCompleteActivity} />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
      
      <NextStepsPopup 
        isOpen={showNextSteps} 
        onClose={handleCloseAll} 
      />
    </>
  );
};

export default ColorfulPopup;
