
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";

interface JournalSectionProps {
  journals: any[];
  isLoading: boolean;
}

const JournalSection: React.FC<JournalSectionProps> = ({ journals, isLoading }) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Recent Journal Entries</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : journals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {journals.map((journal, index) => (
              <motion.div
                key={journal.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(journal.created_at).toLocaleDateString()}
                    </p>
                    <p className="line-clamp-3">{journal.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">
            No journal entries yet. Start journaling to track your thoughts and feelings.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalSection;
