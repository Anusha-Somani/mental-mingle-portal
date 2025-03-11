
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

// Resources data for each category
const resourceData = {
  "Bullying": {
    worksheets: [
      {
        title: "Bullying Self-Assessment",
        pages: 2,
        type: "PDF",
        url: "/assets/worksheets/bullying-self-assessment.pdf" 
      },
      {
        title: "Bullying Action Plan",
        pages: 4,
        type: "Fillable PDF",
        url: "/assets/worksheets/bullying-action-plan.pdf"
      },
      {
        title: "Weekly Bullying Tracker",
        pages: 1,
        type: "Printable",
        url: "/assets/worksheets/bullying-weekly-tracker.pdf"
      }
    ],
    articles: [
      {
        title: "The Science Behind Bullying",
        readTime: "5 min read",
        author: "Dr. Emma Johnson",
        url: "https://www.stopbullying.gov/resources/research-resources/consequences-of-bullying"
      },
      {
        title: "5 Ways to Handle Bullying",
        readTime: "8 min read",
        author: "Michael Stevens",
        url: "https://www.stopbullying.gov/prevention/how-to-prevent-bullying"
      },
      {
        title: "Bullying in School Settings",
        readTime: "6 min read",
        author: "Prof. Sarah Williams",
        url: "https://www.stopbullying.gov/bullying/at-school"
      }
    ],
    videos: [
      {
        title: "Understanding Bullying",
        duration: "5:24",
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
        source: "YouTube",
        url: "https://www.youtube.com/watch?v=CFbp9NcQF6U"
      },
      {
        title: "Strategies for Bullying",
        duration: "8:12",
        thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
        source: "Custom",
        url: "https://www.youtube.com/watch?v=ynTuA_tlZDE"
      },
      {
        title: "Expert Advice on Bullying",
        duration: "12:05",
        thumbnail: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&q=80",
        source: "YouTube",
        url: "https://www.youtube.com/watch?v=9SgOV6K7Lro"
      }
    ]
  },
  "Academic Pressure": {
    worksheets: [
      {
        title: "Academic Pressure Self-Assessment",
        pages: 2,
        type: "PDF",
        url: "/assets/worksheets/academic-self-assessment.pdf"
      },
      {
        title: "Academic Pressure Action Plan",
        pages: 3,
        type: "Fillable PDF",
        url: "/assets/worksheets/academic-action-plan.pdf"
      },
      {
        title: "Study Schedule Template",
        pages: 1,
        type: "Printable",
        url: "/assets/worksheets/study-schedule-template.pdf"
      }
    ],
    articles: [
      {
        title: "The Science Behind Academic Pressure",
        readTime: "6 min read",
        author: "Dr. Alex Chen",
        url: "https://www.apa.org/topics/stress/academic-stress"
      },
      {
        title: "5 Ways to Handle Academic Pressure",
        readTime: "7 min read",
        author: "Lisa Thompson",
        url: "https://www.oxfordlearning.com/how-to-manage-academic-stress/"
      },
      {
        title: "Academic Pressure in High School",
        readTime: "8 min read",
        author: "Prof. Robert Davis",
        url: "https://www.healthychildren.org/English/ages-stages/teen/school/Pages/Helping-Teens-Handle-Pressure-Stress-Management.aspx"
      }
    ],
    videos: [
      {
        title: "Understanding Academic Pressure",
        duration: "7:15",
        thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
        source: "YouTube",
        url: "https://www.youtube.com/watch?v=FhG-VoRtkKY"
      },
      {
        title: "Strategies for Academic Pressure",
        duration: "10:22",
        thumbnail: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&q=80",
        source: "Custom",
        url: "https://www.youtube.com/watch?v=WowPWc4IJ3s"
      },
      {
        title: "Expert Advice on Academic Pressure",
        duration: "15:40",
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
        source: "YouTube",
        url: "https://www.youtube.com/watch?v=8UG489TuMwY"
      }
    ]
  },
  "Self Awareness": {
    worksheets: [
      {
        title: "Self Awareness Assessment",
        pages: 3,
        type: "PDF",
        url: "/assets/worksheets/self-awareness-assessment.pdf"
      },
      {
        title: "Self Reflection Journal",
        pages: 5,
        type: "Fillable PDF",
        url: "/assets/worksheets/self-reflection-journal.pdf"
      },
      {
        title: "Personal Strengths Finder",
        pages: 2,
        type: "Printable",
        url: "/assets/worksheets/personal-strengths-finder.pdf"
      }
    ],
    articles: [
      {
        title: "The Science Behind Self Awareness",
        readTime: "7 min read",
        author: "Dr. Daniel Goleman",
        url: "https://www.psychologytoday.com/us/blog/the-right-mindset/202006/what-actually-is-self-awareness"
      },
      {
        title: "5 Ways to Develop Self Awareness",
        readTime: "6 min read",
        author: "Maria Johnson",
        url: "https://positivepsychology.com/self-awareness-exercises-activities-test/"
      },
      {
        title: "Self Awareness in Teens",
        readTime: "9 min read",
        author: "Prof. James Martin",
        url: "https://www.mindbodygreen.com/articles/self-awareness"
      }
    ],
    videos: [
      {
        title: "Understanding Self Awareness",
        duration: "8:45",
        thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
        source: "YouTube",
        url: "https://www.youtube.com/watch?v=tGdsOXZpyWE"
      },
      {
        title: "Strategies for Self Awareness",
        duration: "12:38",
        thumbnail: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&q=80",
        source: "Custom",
        url: "https://www.youtube.com/watch?v=OsWlVsDYYmw"
      },
      {
        title: "Expert Advice on Self Awareness",
        duration: "14:22",
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
        source: "YouTube",
        url: "https://www.youtube.com/watch?v=dlMUc4LS3EA"
      }
    ]
  },
  "Confidence Building": {
    worksheets: [
      {
        title: "Confidence Self-Assessment",
        pages: 2,
        type: "PDF",
        url: "/assets/worksheets/confidence-self-assessment.pdf"
      },
      {
        title: "Confidence Building Plan",
        pages: 4,
        type: "Fillable PDF",
        url: "/assets/worksheets/confidence-building-plan.pdf"
      },
      {
        title: "Daily Affirmations Template",
        pages: 1,
        type: "Printable",
        url: "/assets/worksheets/daily-affirmations.pdf"
      }
    ],
    articles: [
      {
        title: "The Science Behind Confidence",
        readTime: "6 min read",
        author: "Dr. Rebecca Lewis",
        url: "https://www.verywellmind.com/what-is-self-confidence-2795892"
      },
      {
        title: "5 Ways to Build Confidence",
        readTime: "7 min read",
        author: "Thomas Wilson",
        url: "https://www.mindtools.com/selfconf.html"
      },
      {
        title: "Confidence Building in Teens",
        readTime: "8 min read",
        author: "Prof. Samantha Harris",
        url: "https://www.psychologytoday.com/us/basics/confidence"
      }
    ],
    videos: [
      {
        title: "Understanding Confidence",
        duration: "9:14",
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
        source: "YouTube",
        url: "https://www.youtube.com/watch?v=l_NYrWqUR40"
      },
      {
        title: "Strategies for Confidence Building",
        duration: "11:35",
        thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
        source: "Custom",
        url: "https://www.youtube.com/watch?v=HtDkg3Xwn7U"
      },
      {
        title: "Expert Advice on Confidence",
        duration: "13:50",
        thumbnail: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&q=80",
        source: "YouTube",
        url: "https://www.youtube.com/watch?v=XIScLaYnECs"
      }
    ]
  },
  "Peer Pressure": {
    worksheets: [
      {
        title: "Peer Pressure Self-Assessment",
        pages: 2,
        type: "PDF",
        url: "/assets/worksheets/peer-pressure-assessment.pdf"
      },
      {
        title: "Response Strategies Worksheet",
        pages: 3,
        type: "Fillable PDF",
        url: "/assets/worksheets/peer-pressure-responses.pdf"
      },
      {
        title: "Boundary Setting Template",
        pages: 1,
        type: "Printable",
        url: "/assets/worksheets/boundary-setting.pdf"
      }
    ],
    articles: [
      {
        title: "The Science Behind Peer Pressure",
        readTime: "5 min read",
        author: "Dr. Jason Miller",
        url: "https://www.healthline.com/health/peer-pressure"
      },
      {
        title: "5 Ways to Handle Peer Pressure",
        readTime: "6 min read",
        author: "Christine Parker",
        url: "https://kidshealth.org/en/teens/peer-pressure.html"
      },
      {
        title: "Peer Pressure in High School",
        readTime: "7 min read",
        author: "Prof. David Thompson",
        url: "https://www.aacap.org/AACAP/Families_and_Youth/Facts_for_Families/FFF-Guide/Peer-Pressure-104.aspx"
      }
    ],
    videos: [
      {
        title: "Understanding Peer Pressure",
        duration: "7:45",
        thumbnail: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&q=80",
        source: "YouTube",
        url: "https://www.youtube.com/watch?v=MUTn3psCH-8"
      },
      {
        title: "Strategies for Peer Pressure",
        duration: "9:28",
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
        source: "Custom",
        url: "https://www.youtube.com/watch?v=uvPzX-xN9u0"
      },
      {
        title: "Expert Advice on Peer Pressure",
        duration: "11:15",
        thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
        source: "YouTube",
        url: "https://www.youtube.com/watch?v=QSXm6-S58Y8"
      }
    ]
  }
};

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
  
  // Get resources for the selected category
  const resources = resourceData[category as keyof typeof resourceData] || {
    videos: [],
    worksheets: [],
    articles: []
  };

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
            {resources.videos.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <a href={video.url} target="_blank" rel="noopener noreferrer" className="block h-full">
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
                </a>
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
            {resources.worksheets.map((worksheet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <a 
                  href={worksheet.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block h-full"
                  download={worksheet.title}
                >
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
                        <Button size="sm" className="flex-1" style={{ backgroundColor: "#FF8A48" }}>
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
            {resources.articles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block"
                >
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
                      <Button size="sm" className="group" style={{ backgroundColor: "#FC68B3" }}>
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
