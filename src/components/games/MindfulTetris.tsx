import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

// Game board dimensions
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;

// Tetromino shapes and colors from MindVincible's palette
const TETROMINOES = [
  {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: "#F5DF4D" // Yellow
  },
  {
    shape: [
      [0, 2, 0],
      [2, 2, 2]
    ],
    color: "#FF8A48" // Orange
  },
  {
    shape: [
      [0, 3, 3],
      [3, 3, 0]
    ],
    color: "#FC68B3" // Pink
  },
  {
    shape: [
      [4, 4, 0],
      [0, 4, 4]
    ],
    color: "#2AC20E" // Green
  },
  {
    shape: [
      [5, 0, 0],
      [5, 5, 5]
    ],
    color: "#3DFDFF" // Cyan
  },
  {
    shape: [
      [0, 0, 6],
      [6, 6, 6]
    ],
    color: "#D5D5F1" // Purple
  },
  {
    shape: [
      [7, 7, 7, 7]
    ],
    color: "#FF8A48" // Orange
  }
];

interface MindfulTetrisProps {
  isPlaying: boolean;
  level: number;
  muted: boolean;
  onScoreChange: (score: number) => void;
  onLinesChange: (lines: number) => void;
  onGameOver: () => void;
}

const MindfulTetris: React.FC<MindfulTetrisProps> = ({ 
  isPlaying, 
  level, 
  muted,
  onScoreChange, 
  onLinesChange, 
  onGameOver 
}) => {
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Game state
  const [board, setBoard] = useState<number[][]>(
    Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill(0))
  );
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentTetromino, setCurrentTetromino] = useState(TETROMINOES[0]);
  const [nextTetromino, setNextTetromino] = useState(TETROMINOES[1]);
  const [position, setPosition] = useState({ x: 3, y: 0 });
  const [dropSpeed, setDropSpeed] = useState(1000);
  
  // Audio elements
  const dropSoundRef = useRef<HTMLAudioElement | null>(null);
  const clearSoundRef = useRef<HTMLAudioElement | null>(null);
  const gameOverSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize canvas and audio
  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext('2d');
      canvasRef.current.width = BOARD_WIDTH * BLOCK_SIZE;
      canvasRef.current.height = BOARD_HEIGHT * BLOCK_SIZE;
    }
    
    // Initialize sounds
    dropSoundRef.current = new Audio('/assets/sounds/drop.mp3');
    clearSoundRef.current = new Audio('/assets/sounds/clear.mp3');
    gameOverSoundRef.current = new Audio('/assets/sounds/gameover.mp3');
    
    return () => {
      // Clean up audio
      dropSoundRef.current = null;
      clearSoundRef.current = null;
      gameOverSoundRef.current = null;
    };
  }, []);
  
  // Update drop speed based on level
  useEffect(() => {
    // Speed up as level increases (1000ms at level 1, ~100ms at level 10)
    setDropSpeed(Math.max(1000 - ((level - 1) * 100), 100));
  }, [level]);
  
  // Generate a random tetromino
  const getRandomTetromino = useCallback(() => {
    const index = Math.floor(Math.random() * TETROMINOES.length);
    return TETROMINOES[index];
  }, []);
  
  // Draw the game board
  const drawBoard = useCallback(() => {
    if (!ctxRef.current) return;
    
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
    
    // Draw board background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
    
    // Draw the grid
    ctx.strokeStyle = "#EEEEEE";
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * BLOCK_SIZE, 0);
      ctx.lineTo(x * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
      ctx.stroke();
    }
    
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * BLOCK_SIZE);
      ctx.lineTo(BOARD_WIDTH * BLOCK_SIZE, y * BLOCK_SIZE);
      ctx.stroke();
    }
    
    // Draw the fixed blocks on the board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y][x] !== 0) {
          const blockValue = board[y][x];
          const tetromino = TETROMINOES.find(t => t.shape.flat().includes(blockValue));
          
          if (tetromino) {
            ctx.fillStyle = tetromino.color;
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 2;
            
            // Draw block with rounded corners
            ctx.beginPath();
            ctx.roundRect(
              x * BLOCK_SIZE + 1, 
              y * BLOCK_SIZE + 1, 
              BLOCK_SIZE - 2, 
              BLOCK_SIZE - 2,
              [4]
            );
            ctx.fill();
            ctx.stroke();
            
            // Add a subtle inner shadow
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(
              x * BLOCK_SIZE + BLOCK_SIZE - 8, 
              y * BLOCK_SIZE + 1, 
              7, 
              BLOCK_SIZE - 2
            );
            ctx.fillRect(
              x * BLOCK_SIZE + 1, 
              y * BLOCK_SIZE + BLOCK_SIZE - 8, 
              BLOCK_SIZE - 2, 
              7
            );
          }
        }
      }
    }
    
    // Draw the current tetromino
    if (currentTetromino && !gameOver) {
      ctx.fillStyle = currentTetromino.color;
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      
      for (let y = 0; y < currentTetromino.shape.length; y++) {
        for (let x = 0; x < currentTetromino.shape[y].length; x++) {
          if (currentTetromino.shape[y][x] !== 0) {
            const posX = (position.x + x) * BLOCK_SIZE;
            const posY = (position.y + y) * BLOCK_SIZE;
            
            // Draw block with rounded corners
            ctx.beginPath();
            ctx.roundRect(
              posX + 1, 
              posY + 1, 
              BLOCK_SIZE - 2, 
              BLOCK_SIZE - 2,
              [4]
            );
            ctx.fill();
            ctx.stroke();
            
            // Add a subtle inner shadow
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(
              posX + BLOCK_SIZE - 8, 
              posY + 1, 
              7, 
              BLOCK_SIZE - 2
            );
            ctx.fillRect(
              posX + 1, 
              posY + BLOCK_SIZE - 8, 
              BLOCK_SIZE - 2, 
              7
            );
          }
        }
      }
    }
  }, [board, currentTetromino, position, gameOver]);
  
  // Check collision
  const checkCollision = useCallback((shape: number[][], posX: number, posY: number) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const newX = posX + x;
          const newY = posY + y;
          
          // Check boundaries
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          
          // Check if position is already taken on the board
          if (newY >= 0 && board[newY][newX] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }, [board]);
  
  // Rotate tetromino
  const rotateTetromino = useCallback(() => {
    if (gameOver || !currentTetromino) return;
    
    const rotated = currentTetromino.shape[0].map((_, i) => 
      currentTetromino.shape.map(row => row[i]).reverse()
    );
    
    // Check if rotation is valid
    if (!checkCollision(rotated, position.x, position.y)) {
      setCurrentTetromino({
        ...currentTetromino,
        shape: rotated
      });
    }
  }, [currentTetromino, position, checkCollision, gameOver]);
  
  // Move tetromino
  const moveTetromino = useCallback((direction: "left" | "right" | "down") => {
    if (gameOver || !currentTetromino) return;
    
    let newX = position.x;
    let newY = position.y;
    
    if (direction === "left") newX -= 1;
    if (direction === "right") newX += 1;
    if (direction === "down") newY += 1;
    
    if (!checkCollision(currentTetromino.shape, newX, newY)) {
      setPosition({ x: newX, y: newY });
      return true;
    }
    
    // If can't move down, lock the piece
    if (direction === "down") {
      lockTetromino();
      return false;
    }
    
    return false;
  }, [position, currentTetromino, checkCollision, gameOver]);
  
  // Hard drop tetromino
  const hardDrop = useCallback(() => {
    if (gameOver || !currentTetromino) return;
    
    let newY = position.y;
    
    // Move down until collision
    while (!checkCollision(currentTetromino.shape, position.x, newY + 1)) {
      newY += 1;
    }
    
    setPosition({ ...position, y: newY });
    lockTetromino();
  }, [position, currentTetromino, checkCollision, gameOver]);
  
  // Lock tetromino in place
  const lockTetromino = useCallback(() => {
    if (!currentTetromino) return;
    
    // Create a new board with the tetromino locked in place
    const newBoard = [...board];
    
    for (let y = 0; y < currentTetromino.shape.length; y++) {
      for (let x = 0; x < currentTetromino.shape[y].length; x++) {
        if (currentTetromino.shape[y][x] !== 0) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          
          // Check if any part of the tetromino is above the top
          if (boardY < 0) {
            setGameOver(true);
            onGameOver();
            if (!muted && gameOverSoundRef.current) {
              gameOverSoundRef.current.play();
            }
            return;
          }
          
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = currentTetromino.shape[y][x];
          }
        }
      }
    }
    
    // Play drop sound
    if (!muted && dropSoundRef.current) {
      dropSoundRef.current.play();
    }
    
    // Check for completed lines
    let completedLines = 0;
    const updatedBoard: number[][] = [];
    
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (newBoard[y].every(cell => cell !== 0)) {
        completedLines += 1;
      } else {
        updatedBoard.push([...newBoard[y]]);
      }
    }
    
    // Add empty lines at the top for each completed line
    for (let i = 0; i < completedLines; i++) {
      updatedBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    
    // Update score and lines
    if (completedLines > 0) {
      // Bonus points for multiple lines at once
      const linePoints = [0, 100, 300, 500, 800];
      const newScore = score + linePoints[completedLines] * level;
      const newLines = lines + completedLines;
      
      setScore(newScore);
      setLines(newLines);
      onScoreChange(newScore);
      onLinesChange(newLines);
      
      // Play clear sound
      if (!muted && clearSoundRef.current) {
        clearSoundRef.current.play();
      }
    }
    
    // Update the board
    setBoard(updatedBoard);
    
    // Set the next tetromino as current
    setCurrentTetromino(nextTetromino);
    setNextTetromino(getRandomTetromino());
    
    // Reset position
    setPosition({ x: 3, y: 0 });
  }, [board, currentTetromino, nextTetromino, position, getRandomTetromino, score, lines, level, onScoreChange, onLinesChange, onGameOver, muted]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      
      switch (e.key) {
        case "ArrowLeft":
          moveTetromino("left");
          break;
        case "ArrowRight":
          moveTetromino("right");
          break;
        case "ArrowDown":
          moveTetromino("down");
          break;
        case "ArrowUp":
          rotateTetromino();
          break;
        case " ": // Space
          hardDrop();
          break;
        case "p":
        case "P":
          // Toggle pause
          break;
        default:
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, gameOver, moveTetromino, rotateTetromino, hardDrop]);
  
  // Game loop
  useEffect(() => {
    let dropInterval: number | null = null;
    
    if (isPlaying && !gameOver) {
      // Auto-drop tetromino
      dropInterval = window.setInterval(() => {
        moveTetromino("down");
      }, dropSpeed);
    }
    
    return () => {
      if (dropInterval) clearInterval(dropInterval);
    };
  }, [isPlaying, gameOver, moveTetromino, dropSpeed]);
  
  // Reset game
  useEffect(() => {
    if (!isPlaying && !gameOver) {
      // Reset game state but keep the score
      setBoard(Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill(0)));
      setCurrentTetromino(getRandomTetromino());
      setNextTetromino(getRandomTetromino());
      setPosition({ x: 3, y: 0 });
      setGameOver(false);
    }
  }, [isPlaying, gameOver, getRandomTetromino]);
  
  // Draw the game
  useEffect(() => {
    if (ctxRef.current) {
      drawBoard();
    }
  }, [board, currentTetromino, nextTetromino, position, gameOver, drawBoard]);
  
  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        className="rounded-lg shadow-lg"
        width={BOARD_WIDTH * BLOCK_SIZE}
        height={BOARD_HEIGHT * BLOCK_SIZE}
      />
      
      {gameOver && (
        <motion.div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-white text-2xl font-bold mb-2">Game Over</h2>
          <p className="text-white mb-6">Final Score: {score}</p>
          <p className="text-white/80 text-center max-w-xs mb-4">
            Take a moment to breathe deeply before trying again.
          </p>
          <Button 
            onClick={() => {
              setGameOver(false);
              setBoard(Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill(0)));
              setScore(0);
              setLines(0);
              onScoreChange(0);
              onLinesChange(0);
              setCurrentTetromino(getRandomTetromino());
              setNextTetromino(getRandomTetromino());
              setPosition({ x: 3, y: 0 });
            }}
            className="bg-[#FC68B3] hover:bg-[#FC68B3]/80"
          >
            Play Again
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default MindfulTetris;
