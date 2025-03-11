
import React from "react";
import { Button } from "@/components/ui/button";

interface GameControlsProps {
  moveTetromino: (dx: number, dy: number) => boolean | void;
  rotateCurrentTetromino: () => void;
  hardDrop: () => void;
  gameStarted: boolean;
  gameOver: boolean;
  isPaused: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  moveTetromino,
  rotateCurrentTetromino,
  hardDrop,
  gameStarted,
  gameOver,
  isPaused
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      <Button
        onClick={() => moveTetromino(-1, 0)}
        disabled={!gameStarted || gameOver || isPaused}
        className="bg-[#3DFDFF] hover:bg-[#3DFDFF]/80 text-black"
      >
        ←
      </Button>
      <div className="grid grid-rows-2 gap-2">
        <Button
          onClick={rotateCurrentTetromino}
          disabled={!gameStarted || gameOver || isPaused}
          className="bg-[#FF8A48] hover:bg-[#FF8A48]/80 text-white"
        >
          ↻
        </Button>
        <Button
          onClick={hardDrop}
          disabled={!gameStarted || gameOver || isPaused}
          className="bg-[#FC68B3] hover:bg-[#FC68B3]/80 text-white"
        >
          ↓↓
        </Button>
      </div>
      <Button
        onClick={() => moveTetromino(1, 0)}
        disabled={!gameStarted || gameOver || isPaused}
        className="bg-[#3DFDFF] hover:bg-[#3DFDFF]/80 text-black"
      >
        →
      </Button>
    </div>
  );
};

export default GameControls;
