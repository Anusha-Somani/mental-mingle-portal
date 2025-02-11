
import { useState } from "react";
import { Heart, Brain, Sun, CloudRain, CloudSun, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Factor {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const factors: Factor[] = [
  { icon: <Heart className="w-6 h-6" />, label: "Relationships", value: "relationships" },
  { icon: <Brain className="w-6 h-6" />, label: "Mental Health", value: "mental_health" },
  { icon: <Sun className="w-6 h-6" />, label: "Weather", value: "weather" },
  { icon: <CloudRain className="w-6 h-6" />, label: "Sleep", value: "sleep" },
  { icon: <CloudSun className="w-6 h-6" />, label: "Work/School", value: "work" },
  { icon: <Leaf className="w-6 h-6" />, label: "Physical Health", value: "physical_health" },
];

interface ContributingFactorsProps {
  selectedFactors: string[];
  onFactorSelect: (factors: string[]) => void;
  disabled?: boolean;
}

const ContributingFactors = ({ selectedFactors, onFactorSelect, disabled = false }: ContributingFactorsProps) => {
  const toggleFactor = (value: string) => {
    if (disabled) return;
    
    const newFactors = selectedFactors.includes(value)
      ? selectedFactors.filter(f => f !== value)
      : [...selectedFactors, value];
    onFactorSelect(newFactors);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 text-center">
        What's contributing to these feelings?
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {factors.map((factor) => (
          <motion.button
            key={factor.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleFactor(factor.value)}
            disabled={disabled}
            className={cn(
              "p-4 rounded-xl flex flex-col items-center gap-2 transition-all",
              selectedFactors.includes(factor.value)
                ? "bg-primary/20 border-2 border-primary"
                : "bg-white border-2 border-gray-200 hover:border-primary/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {factor.icon}
            <span className="text-sm font-medium text-gray-700">{factor.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ContributingFactors;
