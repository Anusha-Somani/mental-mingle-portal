
import GameModule from "./GameModule";
import { bullyingConfig } from "./configs";

interface BullyingGameModuleProps {
  userId: string | null;
}

const BullyingGameModule: React.FC<BullyingGameModuleProps> = ({ userId }) => {
  return (
    <GameModule 
      userId={userId} 
      title={bullyingConfig.title}
      titleIcon={bullyingConfig.titleIcon}
      titleColor={bullyingConfig.titleColor}
      modules={bullyingConfig.modules}
      badges={bullyingConfig.badges}
      startingModuleId={bullyingConfig.startingModuleId}
    />
  );
};

export default BullyingGameModule;
