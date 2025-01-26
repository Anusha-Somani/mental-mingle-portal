import Navigation from "@/components/Navigation";

const Resources = () => {
  const resources = [
    {
      title: "Mental Health Basics",
      description: "Understanding common mental health challenges and coping strategies.",
      category: "All",
    },
    {
      title: "Teen Support Guide",
      description: "Resources specifically designed for teenagers navigating mental health.",
      category: "Teens",
    },
    {
      title: "Parent's Handbook",
      description: "Guidelines for supporting your teen's mental well-being.",
      category: "Parents",
    },
    {
      title: "Classroom Strategies",
      description: "Tools for educators to create supportive learning environments.",
      category: "Educators",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Mental Health Resources
          </h1>
          <p className="text-gray-600">
            Curated resources to support mental health awareness and understanding.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
          {resources.map((resource) => (
            <div
              key={resource.title}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <span className="inline-block px-3 py-1 rounded-full text-sm bg-secondary/20 text-secondary-foreground mb-4">
                {resource.category}
              </span>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {resource.title}
              </h2>
              <p className="text-gray-600">{resource.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Resources;