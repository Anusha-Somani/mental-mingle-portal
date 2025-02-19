
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const PuzzleGame = () => {
  const { toast } = useToast();
  const [pieces, setPieces] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    // Initialize puzzle with shuffled pieces
    const shuffled = Array.from({ length: 9 }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    setPieces(shuffled);
  }, []);

  const handlePieceClick = (index: number) => {
    const emptyIndex = pieces.indexOf(8); // 8 represents empty space
    if (isAdjacent(index, emptyIndex)) {
      const newPieces = [...pieces];
      [newPieces[index], newPieces[emptyIndex]] = [newPieces[emptyIndex], newPieces[index]];
      setPieces(newPieces);
      setMoves(moves + 1);
      
      // Check if puzzle is solved
      if (newPieces.every((piece, i) => piece === i)) {
        setSolved(true);
        toast({
          title: "Congratulations! 🎉",
          description: `You solved the puzzle in ${moves + 1} moves!`,
        });
      }
    }
  };

  const isAdjacent = (index1: number, index2: number) => {
    const row1 = Math.floor(index1 / 3);
    const col1 = index1 % 3;
    const row2 = Math.floor(index2 / 3);
    const col2 = index2 % 3;
    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
  };

  const resetPuzzle = () => {
    const shuffled = Array.from({ length: 9 }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    setPieces(shuffled);
    setMoves(0);
    setSolved(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3DFDFF]/10 to-[#FC68B3]/10">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-center mb-6 text-[#1A1F2C]">
              Calming Puzzle Challenge
            </h1>
            
            <div className="aspect-square bg-[#F1F0FB] rounded-lg overflow-hidden mb-4">
              <div className="grid grid-cols-3 gap-1 h-full p-1">
                {pieces.map((piece, index) => (
                  <motion.button
                    key={piece}
                    className={`${
                      piece === 8 ? 'invisible' : 'bg-[#E5DEFF] hover:bg-[#D3E4FD]'
                    } rounded-md flex items-center justify-center text-lg font-medium transition-colors`}
                    onClick={() => handlePieceClick(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {piece + 1}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="text-center mb-4">
              <p className="text-[#1A1F2C]">Moves: {moves}</p>
            </div>

            <Button 
              onClick={resetPuzzle}
              className="w-full bg-[#FC68B3] hover:bg-[#FC68B3]/80"
            >
              Reset Puzzle
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PuzzleGame;
