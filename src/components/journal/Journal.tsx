
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import JournalAreas, { journalAreas } from "./JournalAreas";
import JournalPrompts from "./JournalPrompts";
import JournalMedia from "./JournalMedia";

interface JournalProps {
  userId: string | null;
  onClose: () => void;
}

const Journal = ({ userId, onClose }: JournalProps) => {
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [promptText, setPromptText] = useState("");
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const { toast } = useToast();

  const handleSelectArea = (areaId: string) => {
    setSelectedArea(areaId);
    setSelectedPrompt(null);
    setPromptText("");
    setShowMediaOptions(false);
  };

  const handleSelectPrompt = (promptId: string, text: string) => {
    setSelectedPrompt(promptId);
    setPromptText(text);
    setShowMediaOptions(true);
  };

  const saveJournalEntry = async (content: string, mediaType: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your journal entry.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedArea || !selectedPrompt || !promptText) {
      toast({
        title: "Incomplete entry",
        description: "Please select an area and a prompt before saving.",
        variant: "destructive",
      });
      return;
    }

    const areaObj = journalAreas.find(area => area.id === selectedArea);
    const areaName = areaObj ? areaObj.name : "Unknown";

    const { error } = await supabase.from("journal_entries").insert({
      user_id: userId,
      area_id: selectedArea,
      area_name: areaName,
      prompt_id: selectedPrompt,
      prompt_text: promptText,
      content,
      media_type: mediaType,
      created_at: new Date().toISOString()
    });

    if (error) {
      console.error("Error saving journal entry:", error);
      throw error;
    }

    // Reset after saving
    setSelectedPrompt(null);
    setPromptText("");
    setShowMediaOptions(false);
  };

  const selectedAreaObj = journalAreas.find(area => area.id === selectedArea);
  const areaColor = selectedAreaObj?.color || "#FF8A48";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between" style={{ backgroundColor: areaColor, color: "white" }}>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            {selectedAreaObj ? `Journal: ${selectedAreaObj.name}` : "Journal Your Thoughts"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-6">
            <JournalAreas 
              selectedArea={selectedArea}
              onSelectArea={handleSelectArea}
            />
            
            {selectedArea && (
              <JournalPrompts
                area={selectedArea}
                selectedPrompt={selectedPrompt}
                onSelectPrompt={handleSelectPrompt}
              />
            )}
            
            {showMediaOptions && (
              <JournalMedia
                promptText={promptText}
                onSaveEntry={saveJournalEntry}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Journal;
