
import React from "react";
import { motion } from "framer-motion";
import { Dice5, Star, ArrowRight, Heart, Brain, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Space {
  id: number;
  type: "start" | "emotion" | "challenge" | "reflection" | "resource" | "bonus";
  label: string;
  description?: string;
  color: string;
  position: { x: number; y: number };
}

interface PlayerToken {
  id: number;
  position: number;
  color: string;
}

interface EmotionQuestBoardProps {
  spaces: Space[];
  playerTokens: PlayerToken[];
  currentPlayerIndex: number;
  onLandOnSpace: (space: Space) => void;
  className?: string;
}

const EmotionQuestBoard: React.FC<EmotionQuestBoardProps> = ({
  spaces,
  playerTokens,
  currentPlayerIndex,
  onLandOnSpace,
  className = "",
}) => {
  // Calculate the SVG viewBox based on the board layout
  const maxX = Math.max(...spaces.map((space) => space.position.x)) + 100;
  const maxY = Math.max(...spaces.map((space) => space.position.y)) + 100;

  // Get space by position (board index)
  const getSpaceByPosition = (position: number): Space => {
    return spaces[position % spaces.length];
  };

  const getSpaceIcon = (type: Space["type"]) => {
    switch (type) {
      case "start":
        return <ArrowRight className="h-5 w-5 text-white" />;
      case "emotion":
        return <Heart className="h-5 w-5 text-white" />;
      case "challenge":
        return <Dice5 className="h-5 w-5 text-white" />;
      case "reflection":
        return <Brain className="h-5 w-5 text-white" />;
      case "resource":
        return <Sparkles className="h-5 w-5 text-white" />;
      case "bonus":
        return <Star className="h-5 w-5 text-white" />;
      default:
        return null;
    }
  };

  const getSpaceColorClass = (type: Space["type"]) => {
    switch (type) {
      case "start":
        return "from-[#2AC20E] to-[#2AC20E]/80";
      case "emotion":
        return "from-[#FC68B3] to-[#FC68B3]/80";
      case "challenge":
        return "from-[#FF8A48] to-[#FF8A48]/80";
      case "reflection":
        return "from-[#3DFDFF] to-[#3DFDFF]/80";
      case "resource":
        return "from-[#F5DF4D] to-[#F5DF4D]/80";
      case "bonus":
        return "from-[#D5D5F1] to-[#D5D5F1]/80";
      default:
        return "from-gray-200 to-gray-100";
    }
  };

  return (
    <div className={`overflow-auto rounded-lg bg-white/60 p-4 ${className}`}>
      <svg
        viewBox={`0 0 ${maxX} ${maxY}`}
        className="w-full h-auto"
        style={{ minHeight: "500px" }}
      >
        {/* Board paths */}
        <path
          d="M 50,50 L 1050,50 L 1050,550 L 50,550 L 50,50"
          fill="none"
          stroke="#D5D5F1"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="15,15"
        />

        {/* Spaces */}
        {spaces.map((space) => (
          <g
            key={space.id}
            transform={`translate(${space.position.x}, ${space.position.y})`}
            onClick={() => onLandOnSpace(space)}
            className="cursor-pointer"
          >
            {/* Space background */}
            <rect
              x="-40"
              y="-40"
              width="80"
              height="80"
              rx="8"
              className={`bg-gradient-to-br ${getSpaceColorClass(
                space.type
              )} shadow-md`}
              fill={space.color}
            />

            {/* Space icon */}
            <foreignObject x="-20" y="-35" width="40" height="40">
              <div className="flex h-full items-center justify-center">
                {getSpaceIcon(space.type)}
              </div>
            </foreignObject>

            {/* Space label */}
            <foreignObject x="-35" y="5" width="70" height="30">
              <div className="flex h-full w-full items-center justify-center overflow-hidden text-center">
                <span className="text-xs font-bold text-white truncate px-1">
                  {space.label}
                </span>
              </div>
            </foreignObject>

            {/* Player tokens */}
            <g>
              {playerTokens
                .filter((token) => token.position % spaces.length === space.id)
                .map((token, idx) => (
                  <circle
                    key={token.id}
                    cx={-20 + idx * 20}
                    cy="-20"
                    r="12"
                    fill={token.color}
                    stroke={
                      currentPlayerIndex === token.id - 1
                        ? "#FFFFFF"
                        : "transparent"
                    }
                    strokeWidth="3"
                    className="animate-pulse"
                  />
                ))}
            </g>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { type: "emotion", label: "Emotions" },
          { type: "challenge", label: "Challenges" },
          { type: "reflection", label: "Reflections" },
          { type: "resource", label: "Resources" },
          { type: "bonus", label: "Bonus" },
          { type: "start", label: "Start" },
        ].map((item) => (
          <Badge
            key={item.type}
            className={`bg-gradient-to-r ${getSpaceColorClass(
              item.type as Space["type"]
            )} px-3 py-1 text-white`}
          >
            {getSpaceIcon(item.type as Space["type"])}
            <span className="ml-1">{item.label}</span>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default EmotionQuestBoard;
