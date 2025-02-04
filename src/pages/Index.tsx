import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Smile, ArrowRight } from "lucide-react";
import Wave from "@/components/Wave";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [illustration, setIllustration] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const generateIllustration = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-illustration');
        
        if (error) throw error;
        
        if (data.data && data.data.length > 0) {
          // Only use the first illustration (girl)
          setIllustration(data.data[0].url);
        }
      } catch (error) {
        console.error('Error generating illustration:', error);
        toast({
          title: "Error",
          description: "Failed to generate illustration. Using fallback image.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateIllustration();
  }, []);

  const features = [
    {
      title: "Daily Check-in",
      description: "Track your mood and emotions with our intuitive daily check-in system.",
      path: "/auth",
      icon: <Smile className="w-8 h-8 text-[#4CAF50]" />,
      color: "bg-white/80",
      hoverColor: "hover:bg-white",
    },
    {
      title: "Guided Activities",
      description: "Access personalized activities to help manage anxiety and stress.",
      path: "/auth",
      icon: <Heart className="w-8 h-8 text-[#FFD700]" />,
      color: "bg-white/80",
      hoverColor: "hover:bg-white",
    },
    {
      title: "Mental Wellness",
      description: "Learn techniques for better mental health and emotional balance.",
      path: "/auth",
      icon: <Brain className="w-8 h-8 text-[#4CAF50]" />,
      color: "bg-white/80",
      hoverColor: "hover:bg-white",
    },
  ];

  return (
    <div className="min-h-screen font-poppins relative bg-gradient-to-b from-[#F2FCE2] to-[#FEF7CD] overflow-hidden">
      <Wave />
      <Navigation />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center lg:pt-32">
          <div className="animate-fade-in">
            <div className="relative mb-12">
              {isLoading ? (
                <div className="relative z-10 w-80 h-80 mx-auto flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="relative max-w-2xl mx-auto">
                  <img 
                    src={illustration || "/placeholder.svg"}
                    alt="Mindful Teen"
                    className="w-[80vh] max-w-full h-auto mx-auto object-contain"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                </div>
              )}
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Journey to
              <span className="block mt-2 bg-gradient-to-r from-[#4CAF50] via-[#FFD700] to-[#4CAF50] bg-clip-text text-transparent animate-gradient-text">
                Mental Wellbeing
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
              Take control of your mental health journey with daily check-ins, guided activities, and personalized support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.path}
                className="group transform transition-all duration-300 hover:-translate-y-2"
              >
                <div 
                  className={`rounded-2xl p-8 h-full backdrop-blur-sm ${feature.color} ${feature.hoverColor} 
                    transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden`}
                >
                  <div className="relative z-10">
                    <div className="mb-6">{feature.icon}</div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                      {feature.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Start Your Wellness Journey Today
            </h3>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Join our supportive community and discover tools and resources designed to help you thrive.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white font-medium rounded-xl group relative overflow-hidden"
            >
              <Link to="/auth" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
