
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface JournalPrompt {
  id: string;
  text: string;
}

const promptsByArea: Record<string, JournalPrompt[]> = {
  anxiety: [
    { id: "anxiety-1", text: "What triggered your anxiety today?" },
    { id: "anxiety-2", text: "What physical sensations do you notice when you feel anxious?" },
    { id: "anxiety-3", text: "What helps you calm down when you're feeling anxious?" },
    { id: "anxiety-4", text: "What are three things you can do right now to reduce your anxiety?" },
    { id: "anxiety-5", text: "What would you tell a friend who was experiencing the same anxiety?" }
  ],
  academic: [
    { id: "academic-1", text: "What academic challenge is most stressful for you right now?" },
    { id: "academic-2", text: "How do you currently manage your study time?" },
    { id: "academic-3", text: "What resources or support could help you with your academic stress?" },
    { id: "academic-4", text: "What's one small step you can take to make your workload more manageable?" },
    { id: "academic-5", text: "How does your academic stress affect other areas of your life?" }
  ],
  sadness: [
    { id: "sadness-1", text: "What events or thoughts triggered your sadness today?" },
    { id: "sadness-2", text: "How do you express your sadness? Do you try to hide it or share it?" },
    { id: "sadness-3", text: "What activities or people help you feel better when you're sad?" },
    { id: "sadness-4", text: "How has your sadness changed over time?" },
    { id: "sadness-5", text: "What would you like others to understand about your sadness?" }
  ],
  anger: [
    { id: "anger-1", text: "What situation made you angry today?" },
    { id: "anger-2", text: "How do you typically respond when you feel angry?" },
    { id: "anger-3", text: "What underlying emotions might be contributing to your anger?" },
    { id: "anger-4", text: "What are some healthy ways you could express your anger?" },
    { id: "anger-5", text: "How might the situation look from the other person's perspective?" }
  ],
  gratitude: [
    { id: "gratitude-1", text: "What are three things you're grateful for today?" },
    { id: "gratitude-2", text: "Who is someone that made a positive impact on your life recently?" },
    { id: "gratitude-3", text: "What's something beautiful you noticed today?" },
    { id: "gratitude-4", text: "What's an obstacle you overcame that you're thankful for now?" },
    { id: "gratitude-5", text: "What's something you take for granted that you're actually grateful for?" }
  ],
  free: [
    { id: "free-1", text: "Write freely about whatever is on your mind today." },
    { id: "free-2", text: "Reflect on your day - the highs, lows, and in-betweens." },
    { id: "free-3", text: "What's something you need to get off your chest?" },
    { id: "free-4", text: "Write a letter to your future self." },
    { id: "free-5", text: "If you could change one thing about today, what would it be and why?" }
  ],
  joy: [
    { id: "joy-1", text: "What brought you joy today, no matter how small?" },
    { id: "joy-2", text: "Describe a moment when you felt truly happy recently." },
    { id: "joy-3", text: "What activities make you lose track of time in a good way?" },
    { id: "joy-4", text: "Who are the people that bring the most happiness to your life?" },
    { id: "joy-5", text: "What's something you're looking forward to?" }
  ]
};

interface JournalPromptsProps {
  area: string;
  selectedPrompt: string | null;
  onSelectPrompt: (promptId: string, promptText: string) => void;
}

const JournalPrompts = ({ area, selectedPrompt, onSelectPrompt }: JournalPromptsProps) => {
  const prompts = promptsByArea[area] || [];

  if (prompts.length === 0) {
    return <div className="text-center py-4">Please select a journaling area.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-medium">Select a prompt:</h3>
      <RadioGroup value={selectedPrompt || ""} className="space-y-3">
        {prompts.map((prompt) => (
          <Card key={prompt.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex items-start space-x-3 py-1">
                <RadioGroupItem
                  value={prompt.id}
                  id={prompt.id}
                  onClick={() => onSelectPrompt(prompt.id, prompt.text)}
                />
                <Label htmlFor={prompt.id} className="cursor-pointer">{prompt.text}</Label>
              </div>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>
    </motion.div>
  );
};

export default JournalPrompts;
export { promptsByArea };
