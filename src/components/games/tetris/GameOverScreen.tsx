
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface GameOverScreenProps {
  gameOver: boolean;
  gameStarted: boolean;
  score: number;
  linesCleared: number;
  level: number;
  startGame: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  gameOver,
  gameStarted,
  score,
  linesCleared,
  level,
  startGame
}) => {
  if (gameStarted && !gameOver) return null;
  
  return (
    <div className="mt-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {gameOver ? "Game Over" : "Mindful Blocks"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {gameOver ? (
            <div className="space-y-2">
              <p>Final Score: {score}</p>
              <p>Lines Cleared: {linesCleared}</p>
              <p>Level Reached: {level}</p>
            </div>
          ) : (
            <p>
              A relaxing block-stacking game designed to help reduce
              anxiety while practicing mindfulness.
            </p>
          )}
          <Button
            onClick={startGame}
            className="mt-4 bg-[#FC68B3] hover:bg-[#FC68B3]/80"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {gameOver ? "Play Again" : "Start Game"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameOverScreen;
