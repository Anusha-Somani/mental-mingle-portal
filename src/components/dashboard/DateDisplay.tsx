import { motion } from "framer-motion";
import { format } from "date-fns";

interface DateDisplayProps {
  date: Date;
}

const DateDisplay = ({ date }: DateDisplayProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight font-poppins">
        {format(date, "EEEE")}
      </h1>
      <p className="text-xl md:text-2xl text-secondary mt-2 font-light">
        {format(date, "MMMM d, yyyy")}
      </p>
    </motion.div>
  );
};

export default DateDisplay;