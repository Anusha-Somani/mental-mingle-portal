
import GameModule from "./GameModule";
import { peerPressureConfig } from "./gameConfigs";

interface PeerPressureGameProps {
  userId: string | null;
}

const PeerPressureGame: React.FC<PeerPressureGameProps> = ({ userId }) => {
  return (
    <GameModule 
      userId={userId} 
      title={peerPressureConfig.title}
      titleIcon={peerPressureConfig.titleIcon}
      titleColor={peerPressureConfig.titleColor}
      modules={peerPressureConfig.modules}
      badges={peerPressureConfig.badges}
      startingModuleId={peerPressureConfig.startingModuleId}
    />
  );
};

export default PeerPressureGame;
