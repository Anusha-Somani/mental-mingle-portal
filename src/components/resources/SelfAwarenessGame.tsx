
import React, { useState } from "react";
import GameModule from "./GameModule";
import { selfAwarenessConfig } from "./gameConfigs";

interface SelfAwarenessGameProps {
  userId: string | null;
  customConfig?: typeof selfAwarenessConfig;
}

const SelfAwarenessGame: React.FC<SelfAwarenessGameProps> = ({ 
  userId, 
  customConfig 
}) => {
  // Use provided custom config or default to the predefined config
  const config = customConfig || selfAwarenessConfig;
  
  return (
    <GameModule 
      userId={userId} 
      title={config.title}
      titleIcon={config.titleIcon}
      titleColor={config.titleColor}
      modules={config.modules}
      badges={config.badges}
      startingModuleId={config.startingModuleId}
    />
  );
};

export default SelfAwarenessGame;
