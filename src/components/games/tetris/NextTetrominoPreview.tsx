
import React from "react";
import { BLOCK_SIZE } from "./constants";
import { TetrominoType } from "./types";

interface NextTetrominoPreviewProps {
  nextTetromino: TetrominoType | null;
}

const NextTetrominoPreview: React.FC<NextTetrominoPreviewProps> = ({ nextTetromino }) => {
  if (!nextTetromino) return null;
  
  const { shape, color } = nextTetromino;
  
  return (
    <div className="bg-white/50 p-2 rounded-lg">
      {shape.map((row, y) => (
        <div key={y} className="flex justify-center">
          {row.map((cell, x) => (
            <div
              key={`next-${y}-${x}`}
              style={{
                width: BLOCK_SIZE - 4,
                height: BLOCK_SIZE - 4,
                backgroundColor: cell ? color : "transparent",
                margin: "2px"
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default NextTetrominoPreview;
