import { motion } from "framer-motion";

const QuoteCard = () => {
  const words = [
    [
      { text: "Y", color: "text-[#FF5733]" }, // Orange-red
      { text: "O", color: "text-[#FFB6B6]" }, // Light pink
      { text: "U", color: "text-[#F4A261]" }, // Secondary color
    ],
    [
      { text: "G", color: "text-[#2A9D8F]" }, // Primary color
      { text: "O", color: "text-[#264653]" }, // Dark blue
      { text: "T", color: "text-[#89B5B2]" }, // Light blue-green
    ],
    [
      { text: "T", color: "text-[#6B7280]" }, // Gray
      { text: "H", color: "text-[#264653]" }, // Dark blue
      { text: "I", color: "text-[#FF5733]" }, // Orange-red
      { text: "S", color: "text-[#F4A261]" }, // Secondary color
      { text: "!", color: "text-[#FFB6B6]" }, // Light pink
    ],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white rounded-3xl p-8 text-center overflow-hidden shadow-lg mt-12 mb-8"
    >
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 px-4">
        {words.map((word, wordIndex) => (
          <div key={wordIndex} className="flex gap-x-1">
            {word.map((letter, letterIndex) => (
              <motion.span
                key={letterIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: (wordIndex * word.length + letterIndex) * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{
                  scale: 1.2,
                  transition: { duration: 0.2 }
                }}
                className={`${letter.color} text-5xl md:text-7xl font-bold font-['Poppins'] tracking-normal`}
                style={{
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
                  display: 'inline-block',
                }}
              >
                {letter.text}
              </motion.span>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuoteCard;