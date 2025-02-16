import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Smile, ArrowRight } from "lucide-react";
import Wave from "@/components/Wave";
const Index = () => {
  const features = [{
    title: "Daily Check-in",
    description: "Track your mood and emotions with our intuitive daily check-in system.",
    path: "/auth",
    icon: <Smile className="w-8 h-8 text-[#3DFDFF]" />,
    color: "bg-white/20",
    hoverColor: "hover:bg-white/30"
  }, {
    title: "Guided Activities",
    description: "Access personalized activities to help manage anxiety and stress.",
    path: "/auth",
    icon: <Heart className="w-8 h-8 text-[#FC68B3]" />,
    color: "bg-white/20",
    hoverColor: "hover:bg-white/30"
  }, {
    title: "Mental Wellness",
    description: "Learn techniques for better mental health and emotional balance.",
    path: "/auth",
    icon: <Brain className="w-8 h-8 text-[#FF8A48]" />,
    color: "bg-white/20",
    hoverColor: "hover:bg-white/30"
  }];
  return <div className="min-h-screen font-poppins relative galaxy-bg overflow-hidden">
      {/* Animated Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <Wave />
      <Navigation />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center lg:pt-32">
          <div>
            <h1 className="text-4xl sm:text-6xl font-bold text-[#1A1F2C] mb-6 leading-tight drop-shadow-lg">
              Your Journey to
              <span className="block mt-2 text-[#1A1F2C] font-bold">
                Mental Wellbeing
              </span>
            </h1>
            <p className="text-xl text-[#1A1F2C] max-w-2xl mx-auto leading-relaxed mb-12 drop-shadow-lg">We're here to ensure you take control of your mental health journey with a platform that provides indualized support for teens, parents and educators, with access to AI chat support powered by clinicians!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {features.map(feature => <Link key={feature.title} to={feature.path} className="group transform transition-all duration-300 hover:-translate-y-2">
                <div className={`rounded-2xl p-8 h-full ${feature.color} backdrop-blur-md border border-white/20
                    ${feature.hoverColor} transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden`}>
                  <div className="relative z-10">
                    <div className="mb-6">{feature.icon}</div>
                    <h2 className="text-2xl font-semibold text-[#1A1F2C] mb-4 drop-shadow-lg">
                      {feature.title}
                    </h2>
                    <p className="text-[#1A1F2C]/90 leading-relaxed drop-shadow">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>)}
          </div>

          <div className="max-w-3xl mx-auto bg-white/20 backdrop-blur-md rounded-2xl p-10 shadow-xl border border-white/20">
            <h3 className="text-2xl font-semibold text-[#1A1F2C] mb-4 drop-shadow-lg">
              Start Your Wellness Journey Today
            </h3>
            <p className="text-[#1A1F2C]/90 mb-8 max-w-xl mx-auto drop-shadow">
              Join our supportive community and discover tools and resources designed to help you thrive.
            </p>
            <Button asChild size="lg" className="bg-[#3DFDFF] hover:bg-[#3DFDFF]/80 text-[#1A1F2C] font-medium rounded-xl group relative overflow-hidden">
              <Link to="/auth" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>;
};
export default Index;