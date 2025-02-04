import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const quotes = [
  "The way you speak to yourself matters",
  "Your mental health is a priority",
  "It's okay not to be okay",
  "Small steps still move you forward",
  "Your feelings are valid",
  "Take care of your mind, it's the only one you've got",
  "Recovery is not linear",
  "You are stronger than you think",
  "Mental health over everything",
  "Be gentle with yourself"
];

const QuoteCard = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Get today's date and use it to select a quote
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % quotes.length;
    setQuote(quotes[quoteIndex]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-[#F2E6E6] rounded-3xl p-8 text-center overflow-hidden mb-12"
    >
      <div className="relative z-10">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-primary leading-tight mb-4 font-['Permanent_Marker',cursive] tracking-wide"
          style={{
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
            lineHeight: '1.3'
          }}
        >
          {quote}
        </motion.h1>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary" />
    </motion.div>
  );
};

export default QuoteCard;