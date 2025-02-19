
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const ChatButton = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1 
      }}
      className="fixed bottom-8 left-8 z-50"
    >
      <div className="relative group">
        <div className="absolute -top-16 left-0 w-48 p-2 glass rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-sm text-[#E5DEFF]">Need someone to talk to? Our AI chat is here to support you 💫</p>
        </div>
        <Button
          onClick={() => navigate("/chat")}
          className="h-20 w-20 rounded-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 shadow-lg group-hover:scale-110 transition-transform duration-200"
        >
          <MessageCircle className="h-10 w-10 text-white" />
        </Button>
      </div>
    </motion.div>
  );
};

export default ChatButton;
