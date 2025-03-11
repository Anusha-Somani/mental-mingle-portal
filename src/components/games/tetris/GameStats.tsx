
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface GameStatsProps {
  score: number;
  level: number;
  linesCleared: number;
}

const GameStats: React.FC<GameStatsProps> = ({ score, level, linesCleared }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Game Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Score:</span>
            <span className="font-bold">{score}</span>
          </div>
          <div className="flex justify-between">
            <span>Level:</span>
            <span className="font-bold">{level}</span>
          </div>
          <div className="flex justify-between">
            <span>Lines:</span>
            <span className="font-bold">{linesCleared}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameStats;
