import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Index = () => {
  const sections = [
    {
      title: "For Teens",
      description: "A safe space to express yourself and find support.",
      path: "/chat",
      color: "bg-primary",
    },
    {
      title: "For Parents",
      description: "Guidance on supporting your teen's mental health journey.",
      path: "/resources",
      color: "bg-secondary",
    },
    {
      title: "For Educators",
      description: "Resources to help create supportive learning environments.",
      path: "/resources",
      color: "bg-accent",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to MindBridge
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bridging the communication gap between teens, parents, and educators
            through supportive mental health resources.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
          {sections.map((section) => (
            <Link
              key={section.title}
              to={section.path}
              className="group"
            >
              <div className={`${section.color} rounded-lg p-6 h-full transition-transform transform hover:scale-105`}>
                <h2 className="text-2xl font-semibold text-white mb-3">
                  {section.title}
                </h2>
                <p className="text-white/90">
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;