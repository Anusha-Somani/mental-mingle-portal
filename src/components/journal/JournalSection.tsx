
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Mic, PenTool, Type, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { journalAreas } from "./JournalAreas";
import Journal from "./Journal";

const JournalSection = () => {
  const navigate = useNavigate();
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Get userId from local storage or context if available
  React.useEffect(() => {
    const getUserId = async () => {
      try {
        const { data: { session } } = await import('@/integrations/supabase/client').then(mod => mod.supabase.auth.getSession());
        if (session) {
          setUserId(session.user.id);
        }
      } catch (error) {
        console.error("Error getting user session:", error);
      }
    };
    
    getUserId();
  }, []);

  const openJournal = () => {
    setIsJournalOpen(true);
  };

  const closeJournal = () => {
    setIsJournalOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 space-y-6 border border-[#D5D5F1]/40"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] flex items-center">
              <BookOpen className="mr-2 h-6 w-6 text-[#FF8A48]" />
              M(in)dvincible Journal
            </h2>
            <p className="text-[#403E43] mt-1 text-sm md:text-base">
              Process your thoughts and feelings through different mediums
            </p>
          </div>
          <Button
            onClick={openJournal}
            className="bg-[#FF8A48] hover:bg-[#FF8A48]/80 text-white px-6 py-2 shadow-md transform transition-transform hover:scale-105"
          >
            Open Journal <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-[#1A1F2C] text-lg">Journal Areas:</h3>
          <div className="flex flex-wrap gap-3">
            {journalAreas.map((area) => (
              <Badge
                key={area.id}
                className="px-4 py-2 cursor-pointer flex items-center text-sm font-medium shadow-sm hover:shadow-md transition-all"
                style={{
                  backgroundColor: `${area.color}30`,
                  color: area.color,
                  borderColor: `${area.color}60`,
                }}
                variant="outline"
                onClick={openJournal}
              >
                {area.icon}
                <span className="ml-2">{area.name}</span>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-[#1A1F2C] text-lg">Expression Mediums:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card
              className="bg-[#FF8A48]/10 border-[#FF8A48]/30 cursor-pointer hover:bg-[#FF8A48]/20 transition-all shadow-sm hover:shadow-md"
              onClick={openJournal}
            >
              <CardContent className="flex flex-col items-center justify-center p-5">
                <Type className="h-10 w-10 mb-3 text-[#FF8A48]" />
                <p className="text-base font-semibold text-[#1A1F2C]">Text</p>
                <p className="text-sm text-[#403E43] mt-2 text-center">Type your thoughts and feelings</p>
              </CardContent>
            </Card>
            
            <Card
              className="bg-[#FC68B3]/10 border-[#FC68B3]/30 cursor-pointer hover:bg-[#FC68B3]/20 transition-all shadow-sm hover:shadow-md"
              onClick={openJournal}
            >
              <CardContent className="flex flex-col items-center justify-center p-5">
                <Mic className="h-10 w-10 mb-3 text-[#FC68B3]" />
                <p className="text-base font-semibold text-[#1A1F2C]">Voice</p>
                <p className="text-sm text-[#403E43] mt-2 text-center">Record your voice messages</p>
              </CardContent>
            </Card>
            
            <Card
              className="bg-[#3DFDFF]/10 border-[#3DFDFF]/30 cursor-pointer hover:bg-[#3DFDFF]/20 transition-all shadow-sm hover:shadow-md"
              onClick={openJournal}
            >
              <CardContent className="flex flex-col items-center justify-center p-5">
                <PenTool className="h-10 w-10 mb-3 text-[#3DFDFF]" />
                <p className="text-base font-semibold text-[#1A1F2C]">Drawing</p>
                <p className="text-sm text-[#403E43] mt-2 text-center">Express through sketches</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {isJournalOpen && (
        <Journal 
          userId={userId} 
          onClose={closeJournal} 
        />
      )}
    </>
  );
};

export default JournalSection;
