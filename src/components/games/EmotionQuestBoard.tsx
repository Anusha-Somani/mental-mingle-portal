import { motion } from "framer-motion";
import {
  Smile, Frown, Angry, Meh, Info, Laugh, BookOpen, Flag, Star
} from "lucide-react";

interface Player {
  id: number;
  name: string;
  position: number;
  avatar: number;
  resiliencePoints: number;
  cards: any[];
}

interface BoardSpace {
  type: string;
  label: string;
}

interface EmotionQuestBoardProps {
  spaces: BoardSpace[];
  players: Player[];
  currentPlayerIndex: number;
}

const AVATARS = [
  "👧", "👦", "👩", "👨", "👱‍♀️", "👱", "👴", "👵", 
  "👲", "👳‍♀️", "👳", "🧕", "👮‍♀️", "👮", "👷‍♀️", "👷"
];

const PLAYER_COLORS = [
  "#FF8A48", "#3DFDFF", "#FC68B3", "#F5DF4D"
];

const EmotionQuestBoard: React.FC<EmotionQuestBoardProps> = ({ 
  spaces, 
  players,
  currentPlayerIndex
}) => {
  // Get space background color based on type
  const getSpaceColor = (type: string) => {
    switch (type) {
      case "joy": return "#F5DF4D30";
      case "sadness": return "#3DFDFF30";
      case "anger": return "#FC68B330";
      case "fear": return "#D5D5F130";
      case "surprise": return "#FF8A4830";
      case "disgust": return "#2AC20E30";
      case "bonus": return "#FFD70030";
      case "start": return "#D5D5F130";
      default: return "#ffffff30";
    }
  };
  
  // Get space border color based on type
  const getSpaceBorderColor = (type: string) => {
    switch (type) {
      case "joy": return "#F5DF4D";
      case "sadness": return "#3DFDFF";
      case "anger": return "#FC68B3";
      case "fear": return "#D5D5F1";
      case "surprise": return "#FF8A48";
      case "disgust": return "#2AC20E";
      case "bonus": return "#FFD700";
      case "start": return "#D5D5F1";
      default: return "#d1d5db";
    }
  };
  
  // Get space icon based on type
  const getSpaceIcon = (type: string) => {
    switch (type) {
      case "joy": return <Smile className="w-5 h-5" style={{ color: "#F5DF4D" }} />;
      case "sadness": return <Frown className="w-5 h-5" style={{ color: "#3DFDFF" }} />;
      case "anger": return <Angry className="w-5 h-5" style={{ color: "#FC68B3" }} />;
      case "fear": return <Meh className="w-5 h-5" style={{ color: "#D5D5F1" }} />;
      case "surprise": return <Laugh className="w-5 h-5" style={{ color: "#FF8A48" }} />;
      case "disgust": return <BookOpen className="w-5 h-5" style={{ color: "#2AC20E" }} />;
      case "bonus": return <Star className="w-5 h-5" style={{ color: "#FFD700" }} />;
      case "start": return <Flag className="w-5 h-5" style={{ color: "#D5D5F1" }} />;
      default: return <Info className="w-5 h-5" style={{ color: "#6b7280" }} />;
    }
  };
  
  // Calculate position for each board space
  const calculatePosition = (index: number, totalSpaces: number) => {
    const boardSize = 600; // Total board width/height
    const centerOffset = boardSize / 2;
    const radius = boardSize * 0.4; // Slightly smaller than half to leave room for players
    
    // Calculate angle based on position
    const angle = (index / totalSpaces) * 2 * Math.PI;
    
    // Calculate x and y coordinates
    const x = centerOffset + radius * Math.cos(angle);
    const y = centerOffset + radius * Math.sin(angle);
    
    return { x, y };
  };
  
  // Calculate player token positions on a space
  const calculatePlayerPosition = (playerIndex: number, totalPlayers: number, spaceX: number, spaceY: number) => {
    const playerRadius = 20; // The radius of the player's token
    
    // If only one player, place in center
    if (totalPlayers === 1) {
      return { x: spaceX, y: spaceY };
    }
    
    // Otherwise, distribute players around the space
    const angle = (playerIndex / totalPlayers) * 2 * Math.PI;
    const offsetRadius = 15; // How far from the center of the space
    
    const x = spaceX + offsetRadius * Math.cos(angle);
    const y = spaceY + offsetRadius * Math.sin(angle);
    
    return { x, y };
  };
  
  // Group players by position
  const getPlayersAtPosition = (position: number) => {
    return players.filter(player => player.position === position);
  };

  return (
    <div className="relative w-[700px] h-[700px] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* Board Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3DFDFF]/5 to-[#FC68B3]/5 flex items-center justify-center">
        <div className="text-6xl text-[#1A1F2C]/5 font-bold">MindVincible</div>
      </div>
      
      {/* Board Spaces */}
      {spaces.map((space, index) => {
        const { x, y } = calculatePosition(index, spaces.length);
        const playersHere = getPlayersAtPosition(index);
        
        return (
          <div key={index} className="absolute" style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}>
            {/* Space */}
            <motion.div 
              className="w-20 h-20 rounded-lg shadow-md flex flex-col items-center justify-center border-2 bg-white"
              style={{ 
                backgroundColor: getSpaceColor(space.type),
                borderColor: getSpaceBorderColor(space.type)
              }}
              whileHover={{ scale: 1.05 }}
              animate={currentPlayerIndex >= 0 && players[currentPlayerIndex].position === index ? 
                { scale: [1, 1.05, 1], boxShadow: "0 0 10px rgba(0,0,0,0.3)" } : {}}
            >
              <div className="mb-1">{getSpaceIcon(space.type)}</div>
              <div className="text-xs font-medium text-center">{space.label}</div>
            </motion.div>
            
            {/* Player Tokens */}
            <div className="absolute top-0 left-0">
              {playersHere.map((player, playerIndex) => {
                const position = calculatePlayerPosition(playerIndex, playersHere.length, 10, 10);
                
                return (
                  <motion.div
                    key={player.id}
                    className="absolute w-8 h-8 rounded-full flex items-center justify-center text-lg select-none"
                    style={{ 
                      backgroundColor: PLAYER_COLORS[(player.id - 1) % PLAYER_COLORS.length],
                      color: ["#F5DF4D"].includes(PLAYER_COLORS[(player.id - 1) % PLAYER_COLORS.length]) ? "black" : "white",
                      zIndex: player.id === players[currentPlayerIndex].id ? 10 : 5,
                      left: `${position.x}px`,
                      top: `${position.y}px`,
                      transform: 'translate(-50%, -50%)',
                      boxShadow: player.id === players[currentPlayerIndex].id ? 
                        '0 0 0 2px white, 0 0 0 4px ' + PLAYER_COLORS[(player.id - 1) % PLAYER_COLORS.length] : 
                        '0 0 0 1px rgba(0,0,0,0.1)'
                    }}
                    animate={player.id === players[currentPlayerIndex].id ? 
                      { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 2 } } : {}}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    {AVATARS[player.avatar]}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {/* Center Board Title */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h3 className="font-bold text-xl text-[#1A1F2C]">Emotion Quest</h3>
        <p className="text-sm text-gray-500">Navigate your feelings</p>
      </div>
    </div>
  );
};

export default EmotionQuestBoard;
