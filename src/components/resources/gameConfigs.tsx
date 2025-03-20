
// This file is now just a re-export of the modular configuration files
// to maintain backward compatibility
export { createIconElement } from './utils/iconUtils';
export { 
  bullyingConfig,
  academicPressureConfig,
  selfAwarenessConfig,
  confidenceBuildingConfig,
  peerPressureConfig,
  emotionalResilienceConfig,
  createCustomGame
} from './configs';
export type { ModuleType } from './types/gameTypes';
