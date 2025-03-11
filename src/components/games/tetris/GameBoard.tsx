
import React from "react";
import { BLOCK_SIZE } from "./constants";
import { BoardType, TetrominoWithPosition } from "./types";

interface GameBoardProps {
  board: BoardType;
  currentTetromino: TetrominoWithPosition | null;
  gameOver: boolean;
  tetrominoes: typeof import("./constants").TETROMINOES;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  currentTetromino, 
  gameOver,
  tetrominoes
}) => {
  // Create a copy of the board to render
  const renderBoard = board.map((row) => [...row]);
  
  // Add the current tetromino to the board for rendering
  if (currentTetromino && !gameOver) {
    const { shape, position } = currentTetromino;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          
          if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < board[0].length) {
            renderBoard[boardY][boardX] = shape[y][x];
          }
        }
      }
    }
  }
  
  return (
    <div className="border-2 border-gray-200 bg-white/50 backdrop-blur-sm rounded-lg overflow-hidden">
      {renderBoard.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className="border border-transparent"
              style={{
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
                backgroundColor: cell
                  ? tetrominoes[cell - 1].color
                  : "transparent"
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
