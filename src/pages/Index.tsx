import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";

const Index = () => {
  const sections = [
    {
      title: "For Teens",
      description: "A safe space to express yourself and find support.",
      path: "/resources",
      color: "bg-primary",
      icon: "👋",
    },
    {
      title: "For Parents",
      description: "Guidance on supporting your teen's mental health journey.",
      path: "/resources",
      color: "bg-secondary",
      icon: "💝",
    },
    {
      title: "For Educators",
      description: "Resources to help create supportive learning environments.",
      path: "/resources",
      color: "bg-accent",
      icon: "📚",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#E9ECEF] font-poppins">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to <span className="text-primary">MindBridge</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your safe space for mental wellness. Connecting teens, parents, and educators 
            through understanding and support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
          {sections.map((section) => (
            <Link
              key={section.title}
              to={section.path}
              className="group transform transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`${section.color} rounded-2xl p-8 h-full shadow-lg hover:shadow-xl transition-shadow`}>
                <div className="text-4xl mb-4">{section.icon}</div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {section.title}
                </h2>
                <p className="text-white/90 leading-relaxed">
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Start Your Journey Today
            </h3>
            <p className="text-gray-600 mb-6">
              Join our community of support and understanding. Together, we can build 
              better mental health awareness and support systems.
            </p>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl"
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