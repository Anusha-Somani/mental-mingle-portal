import { motion } from "framer-motion";

const QuoteCard = () => {
  const letters = [
    { text: "Y", color: "text-[#FF5733]" }, // Orange-red
    { text: "O", color: "text-[#FFB6B6]" }, // Light pink
    { text: "U", color: "text-[#F4A261]" }, // Secondary color (warm yellow)
    { text: "G", color: "text-[#2A9D8F]" }, // Primary color (sea green)
    { text: "O", color: "text-[#264653]" }, // Dark blue
    { text: "T", color: "text-[#89B5B2]" }, // Light blue-green
    { text: "T", color: "text-[#6B7280]" }, // Gray
    { text: "H", color: "text-[#264653]" }, // Dark blue
    { text: "I", color: "text-[#FF5733]" }, // Orange-red
    { text: "S", color: "text-[#F4A261]" }, // Secondary color
    { text: "!", color: "text-[#FFB6B6]" }, // Light pink
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white rounded-3xl p-8 text-center overflow-hidden shadow-lg mt-12 mb-8"
    >
      <div className="flex flex-wrap justify-center gap-x-2 gap-y-4 px-4">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut"
            }}
            className={`${letter.color} text-5xl md:text-7xl font-bold font-['Poppins'] tracking-wider`}
            style={{
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
              display: 'inline-block',
            }}
          >
            {letter.text}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default QuoteCard;