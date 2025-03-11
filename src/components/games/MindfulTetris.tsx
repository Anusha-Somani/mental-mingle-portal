
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, RefreshCw, PauseCircle, PlayCircle, Wind } from "lucide-react";
import BreathingGuide from "./BreathingGuide";

// Tetris constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 24;

// Tetromino shapes
const TETROMINOES = [
  {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: "#FF8A48"
  },
  {
    shape: [
      [0, 2, 0],
      [2, 2, 2]
    ],
    color: "#FC68B3"
  },
  {
    shape: [
      [0, 3, 3],
      [3, 3, 0]
    ],
    color: "#3DFDFF"
  },
  {
    shape: [
      [4, 4, 0],
      [0, 4, 4]
    ],
    color: "#F5DF4D"
  },
  {
    shape: [
      [5, 5, 5, 5]
    ],
    color: "#D5D5F1"
  },
  {
    shape: [
      [0, 0, 6],
      [6, 6, 6]
    ],
    color: "#2AC20E"
  },
  {
    shape: [
      [7, 0, 0],
      [7, 7, 7]
    ],
    color: "#6B7FD7"
  }
];

// Mindful prompts that appear as player plays
const MINDFUL_PROMPTS = [
  "Notice your breathing - is it fast or slow?",
  "How do your shoulders feel right now?",
  "Pay attention to the colors as they fall",
  "Can you feel your feet on the floor?",
  "Take a deep breath between moves",
  "Notice any thoughts without judging them",
  "Bring awareness to how your hands feel",
  "Are you holding tension anywhere?",
  "Stay present with each piece as it falls",
  "Observe any feelings of frustration without reacting",
  "Feel the weight of your body in your chair",
  "Notice the sounds around you",
  "Are you rushing? Try slowing down",
  "Bring gentle awareness to your jaw - is it tense?",
  "Remember, it's just a game - enjoy the process"
];

const MindfulTetris = () => {
  // Game state
  const [board, setBoard] = useState<number[][]>([]);
  const [currentTetromino, setCurrentTetromino] = useState<{
    shape: number[][];
    position: { x: number; y: number };
    rotation: number;
    color: string;
  } | null>(null);
  const [nextTetromino, setNextTetromino] = useState<{
    shape: number[][];
    color: string;
  } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);
  const [showBreathingGuide, setShowBreathingGuide] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  
  // References for game loop
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const dropTimeRef = useRef<number>(1000); // Initial drop time in ms
  const dropCounterRef = useRef<number>(0);
  
  // Initialize the game board
  const initializeBoard = useCallback(() => {
    const newBoard = Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(0));
    setBoard(newBoard);
    return newBoard;
  }, []);
  
  // Generate a random tetromino
  const generateRandomTetromino = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * TETROMINOES.length);
    const tetromino = TETROMINOES[randomIndex];
    return {
      shape: tetromino.shape,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      rotation: 0,
      color: tetromino.color
    };
  }, []);
  
  // Create the next tetromino preview
  const generateNextTetromino = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * TETROMINOES.length);
    const tetromino = TETROMINOES[randomIndex];
    return {
      shape: tetromino.shape,
      color: tetromino.color
    };
  }, []);
  
  // Change the mindfulness prompt
  const changePrompt = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * MINDFUL_PROMPTS.length);
    setCurrentPrompt(MINDFUL_PROMPTS[randomIndex]);
  }, []);
  
  // Start a new game
  const startGame = useCallback(() => {
    initializeBoard();
    setCurrentTetromino(generateRandomTetromino());
    setNextTetromino(generateNextTetromino());
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    setLevel(1);
    setLinesCleared(0);
    changePrompt();
    dropTimeRef.current = 1000;
    setGameStarted(true);
    
    // Set up prompt change interval
    const promptInterval = setInterval(() => {
      if (!isPaused && !gameOver) {
        changePrompt();
      }
    }, 15000); // Change prompt every 15 seconds
    
    return () => clearInterval(promptInterval);
  }, [initializeBoard, generateRandomTetromino, generateNextTetromino, changePrompt, isPaused, gameOver]);
  
  // Check if the current move is valid
  const isValidMove = useCallback(
    (shape: number[][], position: { x: number; y: number }) => {
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x] !== 0) {
            const boardX = position.x + x;
            const boardY = position.y + y;
            
            // Check if outside the board or colliding with another piece
            if (
              boardX < 0 ||
              boardX >= BOARD_WIDTH ||
              boardY >= BOARD_HEIGHT ||
              (boardY >= 0 && board[boardY][boardX] !== 0)
            ) {
              return false;
            }
          }
        }
      }
      return true;
    },
    [board]
  );
  
  // Rotate a tetromino
  const rotateTetromino = useCallback(
    (shape: number[][]) => {
      // Transpose the matrix
      const rotated = shape[0].map((_, colIndex) =>
        shape.map((row) => row[colIndex])
      );
      // Reverse each row to get a 90-degree rotation
      return rotated.map((row) => [...row].reverse());
    },
    []
  );
  
  // Merge the current tetromino into the board
  const mergeTetromino = useCallback(() => {
    if (!currentTetromino) return;
    
    const newBoard = [...board.map((row) => [...row])];
    const { shape, position, color } = currentTetromino;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          
          if (boardY >= 0) {
            newBoard[boardY][boardX] = shape[y][x];
          }
        }
      }
    }
    
    setBoard(newBoard);
    
    // Spawn a new tetromino
    const newTetromino = {
      shape: nextTetromino?.shape || generateRandomTetromino().shape,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      rotation: 0,
      color: nextTetromino?.color || generateRandomTetromino().color
    };
    
    // Check if game is over
    if (!isValidMove(newTetromino.shape, newTetromino.position)) {
      setGameOver(true);
      return;
    }
    
    setCurrentTetromino(newTetromino);
    setNextTetromino(generateNextTetromino());
    
    // Check for completed lines
    checkForCompleteLines(newBoard);
  }, [board, currentTetromino, nextTetromino, isValidMove, generateNextTetromino, generateRandomTetromino]);
  
  // Check for completed lines and update the score
  const checkForCompleteLines = useCallback(
    (boardToCheck: number[][]) => {
      let newBoard = [...boardToCheck];
      let completedLines = 0;
      
      for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (newBoard[y].every((cell) => cell !== 0)) {
          // Complete line found - clear it and move everything down
          newBoard.splice(y, 1);
          newBoard.unshift(Array(BOARD_WIDTH).fill(0));
          completedLines++;
          y++; // Check the same row again
        }
      }
      
      if (completedLines > 0) {
        // Update score based on lines cleared
        const points = calculateScore(completedLines);
        setScore((prevScore) => prevScore + points);
        setLinesCleared((prev) => {
          const newLines = prev + completedLines;
          // Level up every 10 lines
          if (Math.floor(newLines / 10) > Math.floor(prev / 10)) {
            setLevel((prevLevel) => {
              const newLevel = prevLevel + 1;
              // Increase speed with each level
              dropTimeRef.current = Math.max(100, 1000 - (newLevel - 1) * 100);
              return newLevel;
            });
          }
          return newLines;
        });
        
        setBoard(newBoard);
      }
    },
    []
  );
  
  // Calculate score based on lines cleared
  const calculateScore = useCallback((lines: number) => {
    const linePoints = [0, 40, 100, 300, 1200]; // Points for 0, 1, 2, 3, 4 lines
    return linePoints[Math.min(lines, 4)] * level;
  }, [level]);
  
  // Move the current tetromino
  const moveTetromino = useCallback(
    (dx: number, dy: number) => {
      if (!currentTetromino || isPaused || gameOver) return;
      
      const newPosition = {
        x: currentTetromino.position.x + dx,
        y: currentTetromino.position.y + dy
      };
      
      if (isValidMove(currentTetromino.shape, newPosition)) {
        setCurrentTetromino({
          ...currentTetromino,
          position: newPosition
        });
        return true;
      }
      
      // If can't move down, merge with the board
      if (dy > 0) {
        mergeTetromino();
      }
      
      return false;
    },
    [currentTetromino, isValidMove, mergeTetromino, isPaused, gameOver]
  );
  
  // Rotate the current tetromino
  const rotateCurrentTetromino = useCallback(() => {
    if (!currentTetromino || isPaused || gameOver) return;
    
    const rotatedShape = rotateTetromino(currentTetromino.shape);
    
    // Try to rotate, and if it doesn't fit, try to shift left or right
    for (let offset = 0; offset <= 2; offset++) {
      for (let dx of [0, -offset, offset]) {
        const newPosition = {
          x: currentTetromino.position.x + dx,
          y: currentTetromino.position.y
        };
        
        if (isValidMove(rotatedShape, newPosition)) {
          setCurrentTetromino({
            ...currentTetromino,
            shape: rotatedShape,
            position: newPosition
          });
          return;
        }
      }
    }
  }, [currentTetromino, rotateTetromino, isValidMove, isPaused, gameOver]);
  
  // Hard drop the tetromino
  const hardDrop = useCallback(() => {
    if (!currentTetromino || isPaused || gameOver) return;
    
    let newY = currentTetromino.position.y;
    
    // Find the lowest valid position
    while (
      isValidMove(currentTetromino.shape, {
        x: currentTetromino.position.x,
        y: newY + 1
      })
    ) {
      newY++;
    }
    
    setCurrentTetromino({
      ...currentTetromino,
      position: { ...currentTetromino.position, y: newY }
    });
    
    mergeTetromino();
  }, [currentTetromino, isValidMove, mergeTetromino, isPaused, gameOver]);
  
  // Toggle pause state
  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);
  
  // Toggle breathing guide
  const toggleBreathingGuide = useCallback(() => {
    setShowBreathingGuide((prev) => !prev);
  }, []);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      
      switch (e.key) {
        case "ArrowLeft":
          moveTetromino(-1, 0);
          break;
        case "ArrowRight":
          moveTetromino(1, 0);
          break;
        case "ArrowDown":
          moveTetromino(0, 1);
          break;
        case "ArrowUp":
          rotateCurrentTetromino();
          break;
        case " ":
          hardDrop();
          break;
        case "p":
        case "P":
          togglePause();
          break;
        case "b":
        case "B":
          toggleBreathingGuide();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    gameStarted,
    gameOver,
    moveTetromino,
    rotateCurrentTetromino,
    hardDrop,
    togglePause,
    toggleBreathingGuide
  ]);
  
  // Game loop
  const gameLoop = useCallback(
    (time: number) => {
      requestRef.current = requestAnimationFrame(gameLoop);
      
      if (gameOver || isPaused) return;
      
      const deltaTime = time - lastTimeRef.current;
      dropCounterRef.current += deltaTime;
      
      if (dropCounterRef.current > dropTimeRef.current) {
        moveTetromino(0, 1);
        dropCounterRef.current = 0;
      }
      
      lastTimeRef.current = time;
    },
    [gameOver, isPaused, moveTetromino]
  );
  
  // Start game loop
  useEffect(() => {
    if (gameStarted && !gameOver) {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameStarted, gameOver, gameLoop]);
  
  // Initialize the game on first load
  useEffect(() => {
    initializeBoard();
    changePrompt();
  }, [initializeBoard, changePrompt]);
  
  // Render the board with the current tetromino
  const renderBoard = () => {
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
            
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
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
                    ? TETROMINOES[cell - 1].color
                    : "transparent"
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  // Render the next tetromino preview
  const renderNextTetromino = () => {
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
  
  // Game controls for mobile players
  const renderMobileControls = () => {
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
            {renderBoard()}
            {/* Mobile controls */}
            <div className="md:hidden w-full">
              {renderMobileControls()}
            </div>
            
            {/* Game over or start screen */}
            {(!gameStarted || gameOver) && (
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
            )}
          </div>
  
          {/* Game info and mindfulness content */}
          <div className="flex flex-col gap-4">
            {/* Game stats */}
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
  
            {/* Next piece preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Next Piece</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                {renderNextTetromino()}
              </CardContent>
            </Card>
  
            {/* Mindfulness prompt */}
            <Card className="bg-[#3DFDFF]/10">
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Heart className="mr-2 h-4 w-4 text-[#FC68B3]" />
                  Mindfulness Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm italic">{currentPrompt}</p>
              </CardContent>
            </Card>
  
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
        {showBreathingGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowBreathingGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-lg p-4 max-w-md w-full m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Breathing Exercise</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBreathingGuide(false)}
                >
                  ✕
                </Button>
              </div>
              <BreathingGuide />
              <p className="text-sm mt-4 text-center">
                Follow this breathing pattern to calm your mind and reduce anxiety.
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MindfulTetris;
