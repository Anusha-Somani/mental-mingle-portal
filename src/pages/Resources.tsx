import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const Resources = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple login simulation
    setIsLoggedIn(true);
  };

  const teenResources = [
    {
      title: "Stress Management Guide",
      description: "Learn effective techniques to manage academic and social stress.",
      category: "Self-Help",
    },
    {
      title: "Peer Support Network",
      description: "Connect with other teens and share experiences in a safe space.",
      category: "Community",
    },
    {
      title: "Mental Wellness Journal",
      description: "Daily prompts and exercises for emotional well-being.",
      category: "Activities",
    },
  ];

  const parentResources = [
    {
      title: "Communication Strategies",
      description: "Tips for opening meaningful conversations with your teen.",
      category: "Guidance",
    },
    {
      title: "Warning Signs Guide",
      description: "Recognize early signs of mental health challenges.",
      category: "Education",
    },
    {
      title: "Family Activity Ideas",
      description: "Bonding activities to strengthen family relationships.",
      category: "Activities",
    },
  ];

  const educatorResources = [
    {
      title: "Classroom Mental Health Kit",
      description: "Tools for creating a supportive learning environment.",
      category: "Teaching Resources",
    },
    {
      title: "Crisis Response Protocol",
      description: "Step-by-step guide for handling mental health emergencies.",
      category: "Safety",
    },
    {
      title: "Student Support Strategies",
      description: "Methods to help students manage academic pressure.",
      category: "Guidance",
    },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-md mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome to MindBridge</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Log In
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Mental Health Resources</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access tailored resources and support for your mental health journey. Select your category below.
          </p>
        </div>

        <Tabs defaultValue="teens" className="w-full animate-fade-in">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="teens">For Teens</TabsTrigger>
            <TabsTrigger value="parents">For Parents</TabsTrigger>
            <TabsTrigger value="educators">For Educators</TabsTrigger>
          </TabsList>

          <TabsContent value="teens" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {teenResources.map((resource) => (
                <Card key={resource.title}>
                  <CardHeader>
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                    <span className="inline-block px-3 py-1 rounded-full text-sm bg-primary/20 text-primary">
                      {resource.category}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{resource.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="parents" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {parentResources.map((resource) => (
                <Card key={resource.title}>
                  <CardHeader>
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                    <span className="inline-block px-3 py-1 rounded-full text-sm bg-secondary/20 text-secondary-foreground">
                      {resource.category}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{resource.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="educators" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {educatorResources.map((resource) => (
                <Card key={resource.title}>
                  <CardHeader>
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                    <span className="inline-block px-3 py-1 rounded-full text-sm bg-accent/20 text-accent-foreground">
                      {resource.category}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{resource.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Need personalized support?</p>
          <Button asChild>
            <Link to="/chat">Chat with our AI Support Assistant</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Resources;