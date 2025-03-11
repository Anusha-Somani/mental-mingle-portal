
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface MindfulPromptProps {
  currentPrompt: string;
}

const MindfulPrompt: React.FC<MindfulPromptProps> = ({ currentPrompt }) => {
  return (
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
  );
};

export default MindfulPrompt;
