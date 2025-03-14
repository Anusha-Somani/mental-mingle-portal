
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Mic, PenTool, Type, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { journalAreas } from "./JournalAreas";

const JournalSection = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const openJournal = () => {
    // For now, we'll just show the floating journal button through Dashboard
    setIsOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 space-y-6 border border-[#D5D5F1]/40"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1F2C] flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-[#FF8A48]" />
            M(in)dvincible Journal
          </h2>
          <p className="text-[#403E43] mt-1">
            Process your thoughts and feelings through different mediums
          </p>
        </div>
        <Button
          onClick={openJournal}
          className="bg-[#FF8A48] hover:bg-[#FF8A48]/80 text-white"
        >
          Open Journal <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div>
        <h3 className="font-medium mb-3 text-[#403E43]">Journal Areas:</h3>
        <div className="flex flex-wrap gap-2">
          {journalAreas.map((area) => (
            <Badge
              key={area.id}
              className="px-3 py-1.5 cursor-pointer flex items-center text-sm"
              style={{
                backgroundColor: `${area.color}20`,
                color: area.color,
                borderColor: `${area.color}40`,
              }}
              variant="outline"
              onClick={openJournal}
            >
              {area.icon}
              <span className="ml-1">{area.name}</span>
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3 text-[#403E43]">Expression Mediums:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card
            className="bg-[#FF8A48]/10 border-[#FF8A48]/20 cursor-pointer hover:bg-[#FF8A48]/20 transition-all"
            onClick={openJournal}
          >
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Type className="h-8 w-8 mb-2 text-[#FF8A48]" />
              <p className="text-sm font-medium text-[#1A1F2C]">Text</p>
              <p className="text-xs text-[#403E43] mt-1 text-center">Type your thoughts and feelings</p>
            </CardContent>
          </Card>
          
          <Card
            className="bg-[#FC68B3]/10 border-[#FC68B3]/20 cursor-pointer hover:bg-[#FC68B3]/20 transition-all"
            onClick={openJournal}
          >
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Mic className="h-8 w-8 mb-2 text-[#FC68B3]" />
              <p className="text-sm font-medium text-[#1A1F2C]">Voice</p>
              <p className="text-xs text-[#403E43] mt-1 text-center">Record your voice messages</p>
            </CardContent>
          </Card>
          
          <Card
            className="bg-[#3DFDFF]/10 border-[#3DFDFF]/20 cursor-pointer hover:bg-[#3DFDFF]/20 transition-all"
            onClick={openJournal}
          >
            <CardContent className="flex flex-col items-center justify-center p-4">
              <PenTool className="h-8 w-8 mb-2 text-[#3DFDFF]" />
              <p className="text-sm font-medium text-[#1A1F2C]">Drawing</p>
              <p className="text-xs text-[#403E43] mt-1 text-center">Express through sketches</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {isOpen && (
        <div className="text-center text-sm text-[#403E43] mt-2 p-3 bg-[#F6F6F7] rounded-lg">
          <span className="flex items-center justify-center">
            <BookOpen className="inline-block h-4 w-4 text-[#FF8A48] mr-1" /> 
            Use the journal button in the bottom right corner to start journaling
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default JournalSection;
