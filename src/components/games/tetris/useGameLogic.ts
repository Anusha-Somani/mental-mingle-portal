
import { useState, useCallback, useRef, useEffect } from "react";
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOES, MINDFUL_PROMPTS } from "./constants";
import { BoardType, TetrominoWithPosition, TetrominoType } from "./types";

export const useGameLogic = () => {
  // Game state
  const [board, setBoard] = useState<BoardType>([]);
  const [currentTetromino, setCurrentTetromino] = useState<TetrominoWithPosition | null>(null);
  const [nextTetromino, setNextTetromino] = useState<TetrominoType | null>(null);
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

  return {
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
    
    // Board utils for rendering
    TETROMINOES
  };
};
