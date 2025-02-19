
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileText, Video, Book, Library } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";
import Wave from "@/components/Wave";

const Resources = () => {
  const [resourceType, setResourceType] = useState<string | null>(null);

  const resourceTypes = [
    {
      title: "PDF Resources",
      icon: FileText,
      description: "Anti-bullying guides, mental health resources, and self-help documents",
      type: "pdf"
    },
    {
      title: "Video Content",
      icon: Video,
      description: "Educational videos, guided meditations, and motivational content",
      type: "video"
    },
    {
      title: "Articles",
      icon: Book,
      description: "Curated articles on mental health, wellness, and personal growth",
      type: "article"
    },
    {
      title: "External Resources",
      icon: Library,
      description: "Links to helpful websites, organizations, and support services",
      type: "external"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden galaxy-bg">
      <StarryBackground />
      <Wave />
      <Navigation />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1F2C] font-playfair mb-4">
            Mental Health Resources
          </h1>
          <p className="text-lg text-[#1A1F2C]/80 max-w-2xl mx-auto">
            Access a curated collection of resources to support your mental well-being journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {resourceTypes.map((resource) => (
            <motion.div
              key={resource.type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="h-full glass border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <resource.icon className="h-6 w-6 text-[#3DFDFF]" />
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#1A1F2C]/80 mb-4">{resource.description}</p>
                  <Button
                    onClick={() => setResourceType(resource.type)}
                    className="w-full bg-[#3DFDFF] hover:bg-[#3DFDFF]/80 text-[#1A1F2C]"
                  >
                    View Resources
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.main>
    </div>
  );
};

export default Resources;
