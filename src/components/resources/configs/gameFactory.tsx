
import { Star } from "lucide-react";
import { createIconElement } from "../utils/iconUtils";
import { GameConfig } from "../types/gameTypes";

// Customizable game configuration template that can be used to create new games
export const createCustomGame = (config: Partial<GameConfig>): GameConfig => {
  const defaultConfig: GameConfig = {
    title: "Custom Game",
    titleIcon: createIconElement(Star),
    titleColor: "#FC68B3",
    startingModuleId: 1001,
    modules: [],
    badges: []
  };
  
  return { ...defaultConfig, ...config };
};
