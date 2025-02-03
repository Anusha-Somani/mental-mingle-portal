import { Trophy, Star } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Achievement {
  id: string;
  achievement_type: string;
  achieved_at: string;
}

interface AchievementCardProps {
  achievements: Achievement[];
}

const AchievementCard = ({ achievements }: AchievementCardProps) => {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Trophy className="w-5 h-5" />
          Achievements
        </CardTitle>
        <CardDescription>Your mood tracking milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg shadow-sm border border-primary/10"
            >
              <Star className="w-8 h-8 text-primary animate-pulse" />
              <div>
                <p className="font-medium">{achievement.achievement_type}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(achievement.achieved_at).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;