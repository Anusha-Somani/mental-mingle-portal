import { Card, CardContent } from "@/components/ui/card";
import MoodCalendar from "@/components/mood/MoodCalendar";

interface CalendarCardProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  disabledDates: Date[];
}

const CalendarCard = ({ selectedDate, onDateSelect, disabledDates }: CalendarCardProps) => {
  return (
    <Card className="lg:col-span-1">
      <CardContent className="pt-6">
        <MoodCalendar
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          disabledDates={disabledDates}
        />
      </CardContent>
    </Card>
  );
};

export default CalendarCard;