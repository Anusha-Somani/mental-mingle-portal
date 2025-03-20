
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { isAfter, startOfDay } from "date-fns";

interface MoodCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  disabledDates?: Date[];
}

const MoodCalendar = ({ selectedDate, onDateSelect, disabledDates = [] }: MoodCalendarProps) => {
  const today = startOfDay(new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-primary">
          {format(selectedDate, "MMMM, yyyy")}
        </h2>
      </div>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && !isAfter(date, today) && onDateSelect(date)}
        className="rounded-md border-primary shadow-sm"
        disabled={(date) => 
          isAfter(date, today) || 
          disabledDates.some(
            disabledDate => 
              format(disabledDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          )
        }
        classNames={{
          day_selected: "bg-primary text-primary-foreground hover:bg-primary/90",
          day_today: "bg-accent text-accent-foreground",
          day_disabled: "text-muted-foreground opacity-50",
          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
        }}
      />
    </motion.div>
  );
};

export default MoodCalendar;
