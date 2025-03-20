
import GameModule from "./GameModule";
import { confidenceBuildingConfig } from "./configs";

interface ConfidenceBuildingGameProps {
  userId: string | null;
}

const ConfidenceBuildingGame: React.FC<ConfidenceBuildingGameProps> = ({ userId }) => {
  return (
    <GameModule 
      userId={userId} 
      title={confidenceBuildingConfig.title}
      titleIcon={confidenceBuildingConfig.titleIcon}
      titleColor={confidenceBuildingConfig.titleColor}
      modules={confidenceBuildingConfig.modules}
      badges={confidenceBuildingConfig.badges}
      startingModuleId={confidenceBuildingConfig.startingModuleId}
    />
  );
};

export default ConfidenceBuildingGame;
