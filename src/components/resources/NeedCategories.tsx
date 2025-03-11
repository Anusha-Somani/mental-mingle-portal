
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldAlert, 
  Book, 
  MessageCircle, 
  Star, 
  Users,
} from "lucide-react";

interface CategoryProgress {
  completed: number;
  total: number;
  percentage: number;
}

interface NeedCategory {
  icon: React.ElementType;
  label: string;
  color: string;
  description: string;
  modules: number[];
}

interface NeedCategoriesProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string) => void;
  userId: string | null;
  userProgress: {
    completedModules: number[];
    level: number;
  };
}

const NeedCategories: React.FC<NeedCategoriesProps> = ({ 
  selectedCategory, 
  setSelectedCategory, 
  userId, 
  userProgress 
}) => {
  const needCategories: NeedCategory[] = [
    { 
      icon: ShieldAlert, 
      label: "Bullying", 
      color: "#3DFDFF", 
      description: "Get support for dealing with bullying situations",
      modules: [1, 2, 3, 4, 5] 
    },
    { 
      icon: Book, 
      label: "Academic Pressure", 
      color: "#FC68B3", 
      description: "Manage stress from school and studies",
      modules: [101, 102, 103, 104]
    },
    { 
      icon: MessageCircle, 
      label: "Self Awareness", 
      color: "#FF8A48", 
      description: "Learn to express and understand your feelings",
      modules: [201, 202, 203, 204]
    },
    { 
      icon: Star, 
      label: "Confidence Building", 
      color: "#F5DF4D", 
      description: "Develop self-esteem and believe in yourself",
      modules: [301, 302, 303, 304]
    },
    { 
      icon: Users, 
      label: "Peer Pressure", 
      color: "#2AC20E", 
      description: "Navigate social situations and make your own choices",
      modules: [401, 402, 403, 404]
    }
  ];

  // Check if category has completed modules
  const getCategoryProgress = (modules: number[]): CategoryProgress => {
    const completedCount = modules.filter(id => 
      userProgress.completedModules.includes(id)
    ).length;
    
    return {
      completed: completedCount,
      total: modules.length,
      percentage: Math.round((completedCount / modules.length) * 100)
    };
  };

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-[#1A1F2C] mb-6 text-center">
        What do you need help with today?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {needCategories.map((category, index) => (
          <motion.button
            key={index}
            onClick={() => setSelectedCategory(category.label)}
            className={`p-6 rounded-xl text-center transition-all flex flex-col items-center h-full ${
              selectedCategory === category.label
                ? 'bg-white shadow-lg scale-105'
                : 'bg-white/50 hover:bg-white hover:shadow-md'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <category.icon 
                className="w-8 h-8"
                style={{ color: category.color }}
              />
            </div>
            <span className="font-semibold text-[#1A1F2C] mb-2">
              {category.label}
            </span>
            <p className="text-sm text-gray-600 mb-2">{category.description}</p>
            
            {userId && (
              <div className="w-full mt-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Progress</span>
                  <span>
                    {getCategoryProgress(category.modules).completed}/{getCategoryProgress(category.modules).total}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${getCategoryProgress(category.modules).percentage}%`,
                      backgroundColor: category.color 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default NeedCategories;
