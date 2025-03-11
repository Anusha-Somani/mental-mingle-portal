
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Puzzle, Music, Gamepad2 } from "lucide-react";

const CalmingActivities = () => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#1A1F2C] mb-4">
        Calming Activities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-[#3DFDFF]/20 to-[#FC68B3]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Puzzle className="w-6 h-6 text-[#FC68B3]" />
              Daily Puzzle Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Take a break with our daily mindfulness puzzle</p>
            <Button 
              className="w-full bg-[#FC68B3] hover:bg-[#FC68B3]/80"
              onClick={() => window.location.href = '/puzzle'}
            >
              Start Puzzle
            </Button>
          </CardContent>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#FF8A48]/20 to-[#F5DF4D]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-6 h-6 text-[#FF8A48]" />
              Calming Music
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Listen to curated playlists for relaxation</p>
            <Button 
              className="w-full bg-[#FF8A48] hover:bg-[#FF8A48]/80"
            >
              Play Music
            </Button>
          </CardContent>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#D5D5F1]/20 to-[#3DFDFF]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-[#3DFDFF]" />
              Mindful Blocks Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">A calming Tetris-style game to reduce anxiety</p>
            <Button 
              className="w-full bg-[#3DFDFF] hover:bg-[#3DFDFF]/80 text-[#1A1F2C]"
              onClick={() => window.location.href = '/tetris'}
            >
              Play Game
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalmingActivities;
