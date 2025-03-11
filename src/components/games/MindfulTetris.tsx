
import React from "react";
import { PlayCircle, PauseCircle, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Import refactored components
import GameBoard from "./tetris/GameBoard";
import NextTetrominoPreview from "./tetris/NextTetrominoPreview";
import GameControls from "./tetris/GameControls";
import BreathingGuideModal from "./tetris/BreathingGuideModal";
import GameStats from "./tetris/GameStats";
import GameOverScreen from "./tetris/GameOverScreen";
import MindfulPrompt from "./tetris/MindfulPrompt";
import { useGameLogic } from "./tetris/useGameLogic";
import { TETROMINOES } from "./tetris/constants";

const MindfulTetris: React.FC = () => {
  const {
    // Game state
    board,
    currentTetromino,
    nextTetromino,
    gameOver,
    isPaused,
    score,
    level,
    linesCleared,
    showBreathingGuide,
    currentPrompt,
    gameStarted,
    
    // Game actions
    startGame,
    togglePause,
    toggleBreathingGuide,
    moveTetromino,
    rotateCurrentTetromino,
    hardDrop,
  } = useGameLogic();
  
  return (
    <div className="p-4 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        {/* Game title and controls */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Mindful Blocks</h2>
          <div className="flex gap-2">
            <Button
              onClick={togglePause}
              disabled={!gameStarted || gameOver}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              {isPaused ? (
                <>
                  <PlayCircle className="mr-1 h-4 w-4" />
                  Resume
                </>
              ) : (
                <>
                  <PauseCircle className="mr-1 h-4 w-4" />
                  Pause
                </>
              )}
            </Button>
            <Button
              onClick={toggleBreathingGuide}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Wind className="mr-1 h-4 w-4" />
              Breathing
            </Button>
          </div>
        </div>
  
        {/* Main game container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Game board */}
          <div className="col-span-2 flex flex-col items-center">
            <GameBoard 
              board={board} 
              currentTetromino={currentTetromino} 
              gameOver={gameOver}
              tetrominoes={TETROMINOES}
            />
            
            {/* Mobile controls - only visible on mobile */}
            <div className="md:hidden w-full">
              <GameControls 
                moveTetromino={moveTetromino}
                rotateCurrentTetromino={rotateCurrentTetromino}
                hardDrop={hardDrop}
                gameStarted={gameStarted}
                gameOver={gameOver}
                isPaused={isPaused}
              />
            </div>
            
            {/* Game over or start screen */}
            <GameOverScreen 
              gameOver={gameOver}
              gameStarted={gameStarted}
              score={score}
              linesCleared={linesCleared}
              level={level}
              startGame={startGame}
            />
          </div>
  
          {/* Game info and mindfulness content */}
          <div className="flex flex-col gap-4">
            {/* Game stats */}
            <GameStats 
              score={score}
              level={level}
              linesCleared={linesCleared}
            />
  
            {/* Next piece preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Next Piece</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <NextTetrominoPreview nextTetromino={nextTetromino} />
              </CardContent>
            </Card>
  
            {/* Mindfulness prompt */}
            <MindfulPrompt currentPrompt={currentPrompt} />
  
            {/* Controls help */}
            <Card className="hidden md:block">
              <CardHeader>
                <CardTitle className="text-sm">Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-1">
                  <p>← → : Move left/right</p>
                  <p>↑ : Rotate</p>
                  <p>↓ : Move down</p>
                  <p>Space : Hard drop</p>
                  <p>P : Pause game</p>
                  <p>B : Breathing guide</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
  
        {/* Breathing guide modal */}
        <BreathingGuideModal 
          showBreathingGuide={showBreathingGuide}
          setShowBreathingGuide={toggleBreathingGuide}
        />
      </div>
    </div>
  );
};

export default MindfulTetris;
