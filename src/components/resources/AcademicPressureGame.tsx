
import GameModule from "./GameModule";
import { academicPressureConfig } from "./configs";

interface AcademicPressureGameProps {
  userId: string | null;
}

const AcademicPressureGame: React.FC<AcademicPressureGameProps> = ({ userId }) => {
  return (
    <GameModule 
      userId={userId} 
      title={academicPressureConfig.title}
      titleIcon={academicPressureConfig.titleIcon}
      titleColor={academicPressureConfig.titleColor}
      modules={academicPressureConfig.modules}
      badges={academicPressureConfig.badges}
      startingModuleId={academicPressureConfig.startingModuleId}
    />
  );
};

export default AcademicPressureGame;
