import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Heart, Smile, Flower2, Brain } from "lucide-react";

const Index = () => {
  const features = [
    {
      title: "For Teens",
      description: "A safe space to express yourself and find support when you need it most.",
      path: "/resources",
      icon: <Smile className="w-8 h-8 text-primary" />,
      color: "bg-primary/10",
      hoverColor: "hover:bg-primary/20",
    },
    {
      title: "For Parents",
      description: "Guidance and resources to better support your teen's mental health journey.",
      path: "/resources",
      icon: <Heart className="w-8 h-8 text-secondary" />,
      color: "bg-secondary/10",
      hoverColor: "hover:bg-secondary/20",
    },
    {
      title: "For Educators",
      description: "Tools and insights to create supportive learning environments.",
      path: "/resources",
      icon: <Brain className="w-8 h-8 text-accent" />,
      color: "bg-accent/10",
      hoverColor: "hover:bg-accent/20",
    },
  ];

  return (
    <div className="min-h-screen font-poppins bg-gradient-to-b from-white to-primary/5">
      <Navigation />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center lg:pt-32">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Journey to
              <span className="text-primary block mt-2">Mental Wellbeing</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
              A supportive community connecting teens, parents, and educators through understanding and growth.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.path}
                className={`group transform transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`rounded-2xl p-8 h-full ${feature.color} ${feature.hoverColor} transition-colors duration-300`}>
                  <div className="mb-6">{feature.icon}</div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Call to Action */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-10 shadow-lg border border-gray-100">
            <div className="flex items-center justify-center mb-6">
              <Flower2 className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Start Your Wellness Journey Today
            </h3>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Join our supportive community and discover tools and resources designed to help you thrive.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-medium rounded-xl"
            >
              <Link to="/resources">Get Started</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;