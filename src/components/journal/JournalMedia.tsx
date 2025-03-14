
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, PenTool, Type, StopCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JournalMediaProps {
  promptText: string;
  onSaveEntry: (content: string, mediaType: string) => Promise<void>;
}

const JournalMedia = ({ promptText, onSaveEntry }: JournalMediaProps) => {
  const [textEntry, setTextEntry] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [drawingData, setDrawingData] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const { toast } = useToast();

  // Handle text entry
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextEntry(e.target.value);
  };

  const saveTextEntry = async () => {
    if (!textEntry.trim()) {
      toast({
        title: "Entry cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await onSaveEntry(textEntry, "text");
      setTextEntry("");
      toast({
        title: "Journal entry saved!",
        description: "Your text entry has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving entry",
        description: "There was a problem saving your entry.",
        variant: "destructive",
      });
    }
  };

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
      };
      
      recorder.start();
      setIsRecording(true);
      setMediaRecorder(recorder);
    } catch (err) {
      console.error("Error accessing the microphone", err);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use this feature.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const saveAudioEntry = async () => {
    if (!audioBlob) {
      toast({
        title: "No recording to save",
        description: "Please record an audio entry first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Convert blob to base64 string for storage
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        await onSaveEntry(base64data, "audio");
        setAudioBlob(null);
        setAudioURL(null);
        toast({
          title: "Voice entry saved!",
          description: "Your voice entry has been saved successfully.",
        });
      };
    } catch (error) {
      toast({
        title: "Error saving entry",
        description: "There was a problem saving your entry.",
        variant: "destructive",
      });
    }
  };

  // Handle drawing
  const initializeCanvas = (canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#1A1F2C";
        setCanvasContext(ctx);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    setCurrentPosition({ x, y });
    
    if (canvasContext) {
      canvasContext.beginPath();
      canvasContext.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasContext) return;
    
    e.preventDefault();
    
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    canvasContext.lineTo(x, y);
    canvasContext.stroke();
    
    setCurrentPosition({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasContext) {
      canvasContext.closePath();
    }
  };

  const saveDrawing = async () => {
    const canvas = document.getElementById("drawingCanvas") as HTMLCanvasElement;
    if (!canvas) return;
    
    const drawingDataUrl = canvas.toDataURL("image/png");
    setDrawingData(drawingDataUrl);
    
    try {
      await onSaveEntry(drawingDataUrl, "drawing");
      
      // Clear the canvas after saving
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      toast({
        title: "Drawing saved!",
        description: "Your drawing has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving entry",
        description: "There was a problem saving your entry.",
        variant: "destructive",
      });
    }
  };

  const clearCanvas = () => {
    const canvas = document.getElementById("drawingCanvas") as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <div className="bg-[#F5F5FA] p-4 rounded-lg mb-4">
        <h3 className="font-medium mb-2">Your prompt:</h3>
        <p className="text-[#1A1F2C]">{promptText}</p>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="text" className="flex items-center">
            <Type className="w-4 h-4 mr-2" />
            Text
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center">
            <Mic className="w-4 h-4 mr-2" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="drawing" className="flex items-center">
            <PenTool className="w-4 h-4 mr-2" />
            Drawing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <Textarea
            placeholder="Write your thoughts here..."
            className="min-h-[200px] bg-white/80 border-[#8B5CF6]/30 text-[#1A1F2C] placeholder:text-[#403E43]/70"
            value={textEntry}
            onChange={handleTextChange}
          />
          <Button 
            onClick={saveTextEntry} 
            className="w-full bg-[#FF8A48] hover:bg-[#FF8A48]/80 text-white"
            disabled={!textEntry.trim()}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Text Entry
          </Button>
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <div className="flex flex-col items-center justify-center bg-white/80 border border-[#8B5CF6]/30 rounded-md p-8 min-h-[200px]">
            {isRecording ? (
              <div className="text-center">
                <div className="animate-pulse bg-red-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <p className="mb-4">Recording in progress...</p>
                <Button 
                  onClick={stopRecording} 
                  variant="outline" 
                  className="bg-red-100 text-red-500 border-red-200 hover:bg-red-200"
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  Stop Recording
                </Button>
              </div>
            ) : audioURL ? (
              <div className="w-full space-y-4">
                <audio src={audioURL} controls className="w-full" />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => { setAudioBlob(null); setAudioURL(null); }} 
                    variant="outline" 
                    className="flex-1"
                  >
                    Record Again
                  </Button>
                  <Button 
                    onClick={saveAudioEntry} 
                    className="flex-1 bg-[#FF8A48] hover:bg-[#FF8A48]/80 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Recording
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Button 
                  onClick={startRecording} 
                  className="bg-[#FC68B3] hover:bg-[#FC68B3]/80 text-white mb-4"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
                <p className="text-sm text-gray-500">Click to start recording your thoughts</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="drawing" className="space-y-4">
          <div className="border border-[#8B5CF6]/30 rounded-md bg-white/80 overflow-hidden">
            <canvas
              id="drawingCanvas"
              width="600"
              height="300"
              className="w-full touch-none"
              ref={initializeCanvas}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={clearCanvas} 
              variant="outline" 
              className="flex-1"
            >
              Clear
            </Button>
            <Button 
              onClick={saveDrawing} 
              className="flex-1 bg-[#FF8A48] hover:bg-[#FF8A48]/80 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Drawing
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default JournalMedia;
