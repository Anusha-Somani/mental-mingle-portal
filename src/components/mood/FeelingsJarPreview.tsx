
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

interface FeelingsJarPreviewProps {
  onShowFullJar: () => void;
}

const FeelingsJarPreview: React.FC<FeelingsJarPreviewProps> = ({ onShowFullJar }) => {
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
            {/* Simplified jar SVG */}
            <svg viewBox="0 0 300 400" className="w-full h-full">
              <path
                d="M 75 100 C 75 80, 225 80, 225 100 L 225 120 C 225 130, 235 140, 235 150 L 245 320 C 245 350, 55 350, 55 320 L 65 150 C 65 140, 75 130, 75 120 Z"
                fill="white"
                stroke="#000"
                strokeWidth="3"
              />
              {/* Sample emotion colors - these would ideally come from saved data */}
              <rect x="65" y="280" width="180" height="40" fill="#3DFDFF" />
              <rect x="65" y="240" width="180" height="40" fill="#FF8A48" />
              <rect x="65" y="200" width="180" height="40" fill="#F5DF4D" />
              <rect x="65" y="160" width="180" height="40" fill="#FC68B3" />
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
