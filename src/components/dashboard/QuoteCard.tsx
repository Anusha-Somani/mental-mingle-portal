import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const quotes = [
  "Every small step counts towards big progress.",
  "Your mental health matters more than anything else.",
  "Take care of your mind, and your mind will take care of you.",
  "It's okay to take a break and recharge.",
  "Your feelings are valid and important.",
  "Growth happens one day at a time.",
  "Be patient with yourself, you're doing great!",
  "Your journey is unique, embrace it.",
  "Small progress is still progress.",
  "You are stronger than you think."
];

const QuoteCard = () => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <Card className="bg-gradient-to-br from-secondary/50 to-accent/30 backdrop-blur-sm">
      <CardContent className="pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="rounded-full bg-primary/10 p-3">
            <Quote className="w-6 h-6 text-primary" />
          </div>
          <p className="text-lg font-medium text-primary leading-relaxed">
            "{randomQuote}"
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;