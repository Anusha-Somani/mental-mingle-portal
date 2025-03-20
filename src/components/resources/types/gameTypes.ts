
import { ReactNode } from 'react';

// Type definition for module types
export type ModuleType = "video" | "activity" | "article";

// Module interface
export interface GameModule {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  xp: number;
  type: ModuleType;
  content?: string | ReactNode;
  linkTo?: string;
}

// Badge interface
export interface GameBadge {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  requiredModules: number[];
}

// Game configuration interface
export interface GameConfig {
  title: string;
  titleIcon: ReactNode;
  titleColor: string;
  startingModuleId: number;
  modules: GameModule[];
  badges: GameBadge[];
}

// Game creator function type
export type GameCreator = (config: Partial<GameConfig>) => GameConfig;
