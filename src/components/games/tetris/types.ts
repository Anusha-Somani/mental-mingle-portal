
export interface TetrominoType {
  shape: number[][];
  color: string;
}

export interface TetrominoWithPosition extends TetrominoType {
  position: { x: number; y: number };
  rotation: number;
}

export type BoardType = number[][];

export type GamePhase = "inhale" | "hold" | "exhale" | "rest";
