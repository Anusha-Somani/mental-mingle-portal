
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BreathingGuide = () => {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  const phaseDurations = {
    inhale: 4,
    hold: 4,
    exhale: 6,
    rest: 2
  };
  
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setCount(prevCount => {
        const duration = phaseDurations[phase];
        if (prevCount >= duration) {
          // Move to next phase
          switch (phase) {
            case "inhale":
              setPhase("hold");
              return 0;
            case "hold":
              setPhase("exhale");
              return 0;
            case "exhale":
              setPhase("rest");
              return 0;
            case "rest":
              setPhase("inhale");
              return 0;
            default:
              return 0;
          }
        }
        return prevCount + 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [phase, isActive]);
  
  const circleVariants = {
    inhale: {
      scale: 1.5,
      transition: { duration: phaseDurations.inhale }
    },
    hold: {
      scale: 1.5,
      transition: { duration: phaseDurations.hold }
    },
    exhale: {
      scale: 1,
      transition: { duration: phaseDurations.exhale }
    },
    rest: {
      scale: 1,
      transition: { duration: phaseDurations.rest }
    }
  };
  
  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "#3DFDFF";
      case "hold":
        return "#F5DF4D";
      case "exhale":
        return "#FC68B3";
      case "rest":
        return "#D5D5F1";
      default:
        return "#3DFDFF";
    }
  };
  
  const getPhaseInstruction = () => {
    switch (phase) {
      case "inhale":
        return "Breathe in...";
      case "hold":
        return "Hold...";
      case "exhale":
        return "Breathe out...";
      case "rest":
        return "Rest...";
      default:
        return "Breathe...";
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center h-40 w-40 relative">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ 
            backgroundColor: `${getPhaseColor()}30`,
            border: `2px solid ${getPhaseColor()}`
          }}
          variants={circleVariants}
          animate={phase}
        />
        <div className="z-10 text-center">
          <div className="text-lg font-medium" style={{ color: getPhaseColor() }}>
            {getPhaseInstruction()}
          </div>
          <div className="text-sm">
            {phaseDurations[phase] - count}
          </div>
        </div>
      </div>
      
      <div className="text-center mt-4 text-sm text-gray-600">
        <p>Follow the circle's rhythm.</p>
        <p>This 4-4-6-2 pattern helps reduce anxiety.</p>
      </div>
      
      <button
        className="mt-4 text-sm underline"
        onClick={() => setIsActive(!isActive)}
      >
        {isActive ? "Pause" : "Resume"}
      </button>
    </div>
  );
};

export default BreathingGuide;
