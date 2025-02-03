import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface MoodCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const MoodCalendar = ({ selectedDate, onDateSelect }: MoodCalendarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md p-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-purple-600">
          {format(selectedDate, "MMMM, yyyy")}
        </h2>
      </div>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect(date)}
        className="rounded-md border shadow-sm"
        classNames={{
          day_selected: "bg-purple-500 text-white hover:bg-purple-600",
          day_today: "bg-purple-100 text-purple-900",
        }}
      />
    </motion.div>
  );
};

export default MoodCalendar;