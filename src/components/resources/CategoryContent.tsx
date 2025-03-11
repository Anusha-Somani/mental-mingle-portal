
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  FileText, 
  BookOpen, 
  Gamepad2,
  ExternalLink,
  Download,
  Eye
} from "lucide-react";
import GameModule from "./GameModule";
import {
  bullyingConfig,
  academicPressureConfig,
  selfAwarenessConfig,
  confidenceBuildingConfig,
  peerPressureConfig
} from "./gameConfigs";

interface CategoryContentProps {
  category: string;
  userId: string | null;
}

const CategoryContent: React.FC<CategoryContentProps> = ({ category, userId }) => {
  const [activeTab, setActiveTab] = useState<string>("game");
  
  const renderGameComponent = () => {
    switch (category) {
      case "Bullying":
        return <GameModule 
          userId={userId} 
          title={bullyingConfig.title}
          titleIcon={bullyingConfig.titleIcon}
          titleColor={bullyingConfig.titleColor}
          modules={bullyingConfig.modules}
          badges={bullyingConfig.badges}
          startingModuleId={bullyingConfig.startingModuleId}
        />;
      case "Academic Pressure":
        return <GameModule 
          userId={userId} 
          title={academicPressureConfig.title}
          titleIcon={academicPressureConfig.titleIcon}
          titleColor={academicPressureConfig.titleColor}
          modules={academicPressureConfig.modules}
          badges={academicPressureConfig.badges}
          startingModuleId={academicPressureConfig.startingModuleId}
        />;
      case "Self Awareness":
        return <GameModule 
          userId={userId} 
          title={selfAwarenessConfig.title}
          titleIcon={selfAwarenessConfig.titleIcon}
          titleColor={selfAwarenessConfig.titleColor}
          modules={selfAwarenessConfig.modules}
          badges={selfAwarenessConfig.badges}
          startingModuleId={selfAwarenessConfig.startingModuleId}
        />;
      case "Confidence Building":
        return <GameModule 
          userId={userId} 
          title={confidenceBuildingConfig.title}
          titleIcon={confidenceBuildingConfig.titleIcon}
          titleColor={confidenceBuildingConfig.titleColor}
          modules={confidenceBuildingConfig.modules}
          badges={confidenceBuildingConfig.badges}
          startingModuleId={confidenceBuildingConfig.startingModuleId}
        />;
      case "Peer Pressure":
        return <GameModule 
          userId={userId} 
          title={peerPressureConfig.title}
          titleIcon={peerPressureConfig.titleIcon}
          titleColor={peerPressureConfig.titleColor}
          modules={peerPressureConfig.modules}
          badges={peerPressureConfig.badges}
          startingModuleId={peerPressureConfig.startingModuleId}
        />;
      default:
        return null;
    }
  };
  
  const videos = [
    {
      title: `Understanding ${category}`,
      duration: "5:24",
      thumbnail: `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80`,
      source: "YouTube"
    },
    {
      title: `Strategies for ${category}`,
      duration: "8:12",
      thumbnail: `https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80`,
      source: "Custom"
    },
    {
      title: `Expert Advice on ${category}`,
      duration: "12:05",
      thumbnail: `https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&q=80`,
      source: "YouTube"
    }
  ];
  
  const worksheets = [
    {
      title: `${category} Self-Assessment`,
      pages: 2,
      type: "PDF",
      url: "#self-assessment"
    },
    {
      title: `${category} Action Plan`,
      pages: 4,
      type: "Fillable PDF",
      url: "#action-plan"
    },
    {
      title: `Weekly ${category} Tracker`,
      pages: 1,
      type: "Printable",
      url: "#weekly-tracker"
    }
  ];
  
  const articles = [
    {
      title: `The Science Behind ${category}`,
      readTime: "5 min read",
      author: "Dr. Emma Johnson",
      url: "#science-article"
    },
    {
      title: `5 Ways to Handle ${category}`,
      readTime: "8 min read",
      author: "Michael Stevens",
      url: "#ways-article"
    },
    {
      title: `${category} in School Settings`,
      readTime: "6 min read",
      author: "Prof. Sarah Williams",
      url: "#school-article"
    }
  ];

  return (
    <Tabs 
      defaultValue="game" 
      className="w-full"
      onValueChange={(value) => setActiveTab(value)}
    >
      <TabsList className="mb-6 grid grid-cols-4 w-full">
        <TabsTrigger value="game" className="flex items-center gap-2">
          <Gamepad2 className="h-4 w-4" />
          Interactive Game
        </TabsTrigger>
        <TabsTrigger value="videos" className="flex items-center gap-2">
          <Video className="h-4 w-4" />
          Videos
        </TabsTrigger>
        <TabsTrigger value="worksheets" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Worksheets
        </TabsTrigger>
        <TabsTrigger value="articles" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Articles
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="game" className="mt-0">
        {renderGameComponent()}
      </TabsContent>
      
      <TabsContent value="videos" className="mt-0">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-[#1A1F2C]">
            Videos About {category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden h-full cursor-pointer hover:shadow-lg transition-all">
                  <div className="relative aspect-video">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Video className="w-12 h-12 text-white" />
                    </div>
                    <Badge variant="secondary" className="absolute top-2 right-2">
                      {video.source}
                    </Badge>
                    <Badge variant="secondary" className="absolute bottom-2 right-2">
                      {video.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-[#1A1F2C] mb-2">{video.title}</h3>
                    <Button variant="outline" size="sm" className="w-full">
                      Watch Video
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="worksheets" className="mt-0">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-[#1A1F2C]">
            Worksheets About {category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {worksheets.map((worksheet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <a href={worksheet.url} className="block h-full">
                  <Card className="h-full hover:shadow-lg transition-all">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="mb-4 p-4 bg-gray-100 rounded-md flex items-center justify-center">
                        <FileText className="h-12 w-12 text-gray-500" />
                      </div>
                      <h3 className="font-semibold text-[#1A1F2C] mb-2">{worksheet.title}</h3>
                      <div className="flex gap-2 mb-4">
                        <Badge variant="outline">{worksheet.pages} pages</Badge>
                        <Badge variant="outline">{worksheet.type}</Badge>
                      </div>
                      <div className="mt-auto flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="mr-1 h-4 w-4" /> Preview
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Download className="mr-1 h-4 w-4" /> Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="articles" className="mt-0">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-[#1A1F2C]">
            Articles About {category}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {articles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <a href={article.url} className="block">
                  <Card className="hover:shadow-md transition-all">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg text-[#1A1F2C] mb-2">{article.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span className="mr-3">By {article.author}</span>
                        <span>{article.readTime}</span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                      </p>
                      <Button size="sm" className="group">
                        Read Article
                        <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CategoryContent;
