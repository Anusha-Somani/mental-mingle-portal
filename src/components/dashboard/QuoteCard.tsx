import { motion } from "framer-motion";
import { Brain } from "lucide-react";

const QuoteCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-[#95B1A0] rounded-3xl p-8 text-center overflow-hidden"
    >
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-4"
        >
          <Brain className="w-16 h-16 text-[#C4A484]" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-white mb-2 font-['Permanent_Marker',cursive]"
        >
          MENTAL HEALTH
        </motion.h1>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-white font-['Permanent_Marker',cursive]"
        >
          MATTERS
        </motion.h1>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <div className="w-8 h-2 bg-white rounded-full rotate-45 mb-2" />
        <div className="w-8 h-2 bg-white rounded-full -rotate-45" />
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <div className="w-8 h-2 bg-white rounded-full rotate-45 mb-2" />
        <div className="w-8 h-2 bg-white rounded-full -rotate-45" />
      </div>
    </motion.div>
  );
};

export default QuoteCard;