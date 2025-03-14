
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  BookOpen, 
  Frown, 
  Angry, 
  HeartHandshake, 
  Pencil, 
  GraduationCap,
  Smile
} from "lucide-react";

export type JournalAreaType = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
};

const journalAreas: JournalAreaType[] = [
  { id: "anxiety", name: "Anxiety", icon: <Brain className="w-5 h-5" />, color: "#FC68B3" },
  { id: "academic", name: "Academic Stress", icon: <GraduationCap className="w-5 h-5" />, color: "#FF8A48" },
  { id: "sadness", name: "Sadness", icon: <Frown className="w-5 h-5" />, color: "#D5D5F1" },
  { id: "anger", name: "Anger", icon: <Angry className="w-5 h-5" />, color: "#FC68B3" },
  { id: "gratitude", name: "Gratitude", icon: <HeartHandshake className="w-5 h-5" />, color: "#2AC20E" },
  { id: "free", name: "Free Journaling", icon: <Pencil className="w-5 h-5" />, color: "#3DFDFF" },
  { id: "joy", name: "Joy & Happiness", icon: <Smile className="w-5 h-5" />, color: "#F5DF4D" },
];

interface JournalAreasProps {
  selectedArea: string;
  onSelectArea: (area: string) => void;
}

const JournalAreas = ({ selectedArea, onSelectArea }: JournalAreasProps) => {
  const selectedAreaObj = journalAreas.find(area => area.id === selectedArea);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center border-[#8B5CF6]/30 bg-white/90 font-medium shadow-md"
          style={{ 
            color: selectedAreaObj?.color || "#403E43",
            borderColor: `${selectedAreaObj?.color || "#8B5CF6"}40`,
            fontWeight: "600"
          }}
        >
          <div className="flex items-center">
            {selectedAreaObj?.icon || <BookOpen className="h-5 w-5" />}
            <span className="ml-2 text-base font-bold">{selectedAreaObj?.name || "Select an area"}</span>
          </div>
          <BookOpen className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 shadow-lg">
        {journalAreas.map((area) => (
          <DropdownMenuItem
            key={area.id}
            onClick={() => onSelectArea(area.id)}
            className="cursor-pointer p-3 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center" style={{ color: area.color }}>
              {area.icon}
              <span className="ml-2 font-bold text-base">{area.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default JournalAreas;
export { journalAreas };
