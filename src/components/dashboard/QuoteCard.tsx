
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const quotes = [
  "I release all worry, and trust in the present moment.",
  "Every day is a new beginning, take a deep breath and start again.",
  "I am stronger than my fears and bigger than my doubts.",
  "Peace begins with a smile within.",
  "In the midst of movement and chaos, keep stillness inside of you.",
  "Trust the journey, even when you can't see the path ahead.",
];

const QuoteCard = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
        setIsVisible(true);
      }, 500); // Wait for exit animation to complete
    }, 5 * 60 * 1000); // Change every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-3xl p-8 text-center overflow-hidden shadow-lg mt-12 mb-8"
      style={{
        background: "linear-gradient(102.3deg, rgba(147,39,143,1) 5.9%, rgba(234,172,232,1) 64%, rgba(246,219,245,1) 89%)",
      }}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
      
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={currentQuoteIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center min-h-[200px] px-4"
            >
              <motion.p 
                className="text-2xl md:text-3xl font-playfair text-white mb-6 leading-relaxed"
                style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}
              >
                "{quotes[currentQuoteIndex]}"
              </motion.p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => {
                    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
                    setIsVisible(true);
                  }, 500);
                }}
                className="px-8 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold backdrop-blur-sm transition-all duration-300 shadow-lg"
              >
                Next Quote
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-[#FC68B3]/20 blur-xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-[#3DFDFF]/20 blur-xl" />
      <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-[#F5DF4D]/20 blur-xl" />
    </motion.div>
  );
};

export default QuoteCard;
