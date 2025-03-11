
import GameModule from "./GameModule";
import { selfAwarenessConfig } from "./gameConfigs";

interface SelfAwarenessGameProps {
  userId: string | null;
}

const SelfAwarenessGame: React.FC<SelfAwarenessGameProps> = ({ userId }) => {
  return (
    <GameModule 
      userId={userId} 
      title={selfAwarenessConfig.title}
      titleIcon={selfAwarenessConfig.titleIcon}
      titleColor={selfAwarenessConfig.titleColor}
      modules={selfAwarenessConfig.modules}
      badges={selfAwarenessConfig.badges}
      startingModuleId={selfAwarenessConfig.startingModuleId}
    />
  );
};

export default SelfAwarenessGame;
