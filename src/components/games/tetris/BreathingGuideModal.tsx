
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import BreathingGuide from "../BreathingGuide";

interface BreathingGuideModalProps {
  showBreathingGuide: boolean;
  setShowBreathingGuide: (show: boolean) => void;
}

const BreathingGuideModal: React.FC<BreathingGuideModalProps> = ({
  showBreathingGuide,
  setShowBreathingGuide
}) => {
  if (!showBreathingGuide) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={() => setShowBreathingGuide(false)}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-lg p-4 max-w-md w-full m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Breathing Exercise</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBreathingGuide(false)}
          >
            ✕
          </Button>
        </div>
        <BreathingGuide />
        <p className="text-sm mt-4 text-center">
          Follow this breathing pattern to calm your mind and reduce anxiety.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default BreathingGuideModal;
