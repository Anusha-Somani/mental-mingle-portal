
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Journal from "./Journal";

interface JournalButtonProps {
  userId: string | null;
}

const JournalButton = ({ userId }: JournalButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          onClick={() => setIsOpen(true)} 
          className="fixed bottom-24 right-8 rounded-full w-14 h-14 bg-[#FF8A48] hover:bg-[#FF8A48]/80 shadow-lg"
          aria-label="Open Journal"
        >
          <BookOpen className="h-6 w-6 text-white" />
        </Button>
      </motion.div>

      {isOpen && (
        <Journal 
          userId={userId} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
};

export default JournalButton;
