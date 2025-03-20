
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkle, ArrowRight } from "lucide-react";

interface NextStepsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const NextStepsPopup: React.FC<NextStepsPopupProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  const handleNavigateToJournal = () => {
    navigate("/dashboard");
    onClose();
    // We'll use the dashboard for journal since there's no separate journal page yet
    // The journal will open via the JournalButton component that's already on the dashboard
    setTimeout(() => {
      const journalButton = document.querySelector('[aria-label="Open Journal"]');
      if (journalButton instanceof HTMLElement) {
        journalButton.click();
      }
    }, 500);
  };
  
  const handleNavigateToResources = () => {
    navigate("/resources", { state: { openCategory: "self-awareness" } });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-none shadow-none p-0 bg-transparent">
        <motion.div
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
          <div className="bg-gradient-to-br from-[#2AC20E] via-[#F5DF4D] to-[#3DFDFF] p-1 rounded-3xl">
            <div className="bg-white/95 rounded-3xl p-8 backdrop-blur-sm">
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex justify-center"
                >
                  <div className="w-20 h-20 rounded-full bg-[#FF8A48]/20 flex items-center justify-center">
                    <span className="text-4xl">✨</span>
                  </div>
                </motion.div>
                
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-2xl font-bold text-[#1A1F2C]"
                >
                  Great job exploring your feelings!
                </motion.h2>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-[#403E43]"
                >
                  Would you like to continue your mindfulness journey?
                </motion.p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <Button 
                      onClick={handleNavigateToJournal}
                      className="w-full sm:w-auto bg-[#FC68B3] hover:bg-[#FC68B3]/80 text-white font-medium rounded-full px-6 py-2 flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      Write in Journal
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <Button 
                      onClick={handleNavigateToResources}
                      className="w-full sm:w-auto bg-[#3DFDFF] hover:bg-[#3DFDFF]/80 text-[#1A1F2C] font-medium rounded-full px-6 py-2 flex items-center gap-2"
                    >
                      <Sparkle className="w-4 h-4" />
                      Self-Awareness Resources
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default NextStepsPopup;
