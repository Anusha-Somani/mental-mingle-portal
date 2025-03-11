
import { motion } from "framer-motion";
import { Video, Puzzle, Music, BookOpen } from "lucide-react";

interface Category {
  icon: React.ElementType;
  label: string;
  color: string;
}

const CategoryExplorer = () => {
  const categories: Category[] = [
    { icon: Video, label: "Videos", color: "#3DFDFF" },
    { icon: Puzzle, label: "Games", color: "#FC68B3" },
    { icon: Music, label: "Music", color: "#FF8A48" },
    { icon: BookOpen, label: "Articles", color: "#F5DF4D" }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-[#1A1F2C] mb-4">
        Explore Categories
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <motion.button
            key={index}
            className="p-6 rounded-xl text-center transition-all bg-white/50 hover:bg-white hover:shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <category.icon 
              className="w-8 h-8 mx-auto mb-2"
              style={{ color: category.color }}
            />
            <span className="font-medium text-[#1A1F2C]">
              {category.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryExplorer;
