
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Paintbrush, Undo2 } from "lucide-react";

interface DrawingCanvasProps {
  onChange: (dataUrl: string) => void;
  initialImage?: string;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onChange, initialImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#FC68B3");
  const [brushSize, setBrushSize] = useState(5);
  const [mode, setMode] = useState<"draw" | "erase">("draw");
  const [history, setHistory] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);

  // Set up canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas size to match display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Set initial drawing styles
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = color;
    context.lineWidth = brushSize;

    setCtx(context);

    // If there's an initial image, draw it
    if (initialImage) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
        saveToHistory();
      };
      img.src = initialImage;
    } else {
      // Initialize with a blank canvas
      saveToHistory();
    }
  }, []);

  // Update drawing styles when colors or brush size changes
  useEffect(() => {
    if (!ctx) return;
    
    if (mode === "draw") {
      ctx.strokeStyle = color;
    } else {
      ctx.strokeStyle = "#FFFFFF"; // White for eraser
    }
    
    ctx.lineWidth = brushSize;
  }, [color, brushSize, mode, ctx]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    setIsDrawing(true);
    
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !ctx) return;
    
    setIsDrawing(false);
    ctx.closePath();
    saveToHistory();
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    return { x, y };
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveToHistory();
  };

  const saveToHistory = () => {
    if (!canvasRef.current) return;
    
    const dataUrl = canvasRef.current.toDataURL('image/png');
    
    // Truncate history if we're not at the most recent step
    const newHistory = history.slice(0, currentStep + 1);
    
    // Add the new state and update the current step
    setHistory([...newHistory, dataUrl]);
    setCurrentStep(newHistory.length);
    
    // Trigger the onChange callback with the new data URL
    onChange(dataUrl);
  };

  const undo = () => {
    if (currentStep <= 0 || !ctx || !canvasRef.current) return;
    
    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    
    const img = new Image();
    img.onload = () => {
      if (!ctx || !canvasRef.current) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
      
      // Trigger the onChange callback with the new data URL
      onChange(history[newStep]);
    };
    img.src = history[newStep];
  };

  const colorOptions = [
    { color: "#FC68B3", name: "Pink" },
    { color: "#F5DF4D", name: "Yellow" },
    { color: "#3DFDFF", name: "Blue" },
    { color: "#FF8A48", name: "Orange" },
    { color: "#2AC20E", name: "Green" },
    { color: "#D5D5F1", name: "Purple" },
    { color: "#000000", name: "Black" }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border-2 border-black relative bg-white">
        <canvas
          ref={canvasRef}
          className="w-full rounded-lg touch-none"
          style={{ height: "300px" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === "draw" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("draw")}
            className="flex items-center gap-1 h-8"
          >
            <Paintbrush size={16} />
            Draw
          </Button>
          <Button
            type="button"
            variant={mode === "erase" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("erase")}
            className="flex items-center gap-1 h-8"
          >
            <Eraser size={16} />
            Erase
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={currentStep <= 0}
            className="h-8"
          >
            <Undo2 size={16} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearCanvas}
            className="h-8"
          >
            Clear
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {colorOptions.map((option) => (
          <button
            key={option.color}
            type="button"
            className={`w-8 h-8 rounded-full transition-all ${
              color === option.color ? "ring-2 ring-offset-2 ring-black" : ""
            }`}
            style={{ backgroundColor: option.color }}
            onClick={() => setColor(option.color)}
            title={option.name}
          />
        ))}
      </div>
    </div>
  );
};

export default DrawingCanvas;
