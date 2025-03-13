import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Smile, ArrowRight, Sparkles, MessageCircle, Users, BookOpen, CheckCircle2, Lightbulb } from "lucide-react";
import Wave from "@/components/Wave";
const Index = () => {
  const audienceCards = [{
    title: "For Teens",
    description: "Fun activities and supportive resources designed specifically for your mental wellbeing journey.",
    icon: <Smile className="w-10 h-10 text-[#FC68B3]" />,
    benefits: ["Daily mood tracking", "Anxiety-reducing games", "Peer connection"]
  }, {
    title: "For Parents",
    description: "Understand your teen better and learn how to provide the right support when they need it most.",
    icon: <Heart className="w-10 h-10 text-[#FF8A48]" />,
    benefits: ["Communication guides", "Warning sign awareness", "Support strategies"]
  }, {
    title: "For Educators",
    description: "Tools and resources to create a supportive classroom environment for students' mental health.",
    icon: <BookOpen className="w-10 h-10 text-[#F5DF4D]" />,
    benefits: ["Classroom activities", "Intervention techniques", "Student support frameworks"]
  }];
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
  const testimonials = [{
    quote: "This app has completely changed how I handle stress before tests. The breathing exercises are a lifesaver!",
    author: "Jamie, 16",
    emoji: "🧠"
  }, {
    quote: "As a parent, I finally feel like I understand what my teen is going through and how to help.",
    author: "Michelle, Parent",
    emoji: "💖"
  }, {
    quote: "The resources available have transformed my classroom's approach to student mental health.",
    author: "Mr. Garcia, Teacher",
    emoji: "📚"
  }];
  return <div className="min-h-screen font-poppins relative galaxy-bg overflow-hidden">
      {/* Animated Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      {/* Floating Characters - Inspired by Ahead app */}
      <div className="absolute top-40 left-[7%] w-20 h-20 emoji z-10 animate-float">
        <div className="w-20 h-20 bg-[#FC68B3] rounded-full flex items-center justify-center shadow-lg">
          <Smile className="w-12 h-12 text-white" />
        </div>
      </div>
      <div className="absolute top-60 right-[10%] w-24 h-24 emoji z-10 animate-float" style={{
      animationDelay: '1.5s'
    }}>
        <div className="w-24 h-24 bg-[#F5DF4D] rounded-full flex items-center justify-center shadow-lg">
          <Sparkles className="w-14 h-14 text-white" />
        </div>
      </div>
      <div className="absolute bottom-32 left-[15%] w-16 h-16 emoji z-10 animate-float" style={{
      animationDelay: '2s'
    }}>
        <div className="w-16 h-16 bg-[#3DFDFF] rounded-full flex items-center justify-center shadow-lg">
          <Brain className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="absolute bottom-80 right-[18%] w-18 h-18 emoji z-10 animate-float" style={{
      animationDelay: '1s'
    }}>
        <div className="w-18 h-18 bg-[#2AC20E] rounded-full flex items-center justify-center shadow-lg">
          <MessageCircle className="w-10 h-10 text-white" />
        </div>
      </div>

      <Wave />
      <Navigation />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center lg:pt-28">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-5xl sm:text-7xl font-bold text-[#1A1F2C] mb-6 leading-tight drop-shadow-lg">
              <span className="block mt-2 text-[#1A1F2C] font-bold">M(in)dvincible</span>
            </h1>
            <p className="text-xl text-[#1A1F2C] max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-lg">
              We're creating connections and support systems for mental wellbeing with a platform that provides individualized support for teens, parents and educators.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-[#FC68B3] hover:bg-[#FC68B3]/80 text-white font-medium rounded-xl">
                <Link to="/auth" className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/30 border-white/50 backdrop-blur-sm text-[#1A1F2C] font-medium rounded-xl hover:bg-white/40">
                <Link to="/resources" className="flex items-center gap-2">
                  Explore Resources
                </Link>
              </Button>
            </div>
          </div>

          {/* Who It's For Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-[#1A1F2C] mb-12">Who We Support</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {audienceCards.map((card, index) => <div key={card.title} className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl transform transition-all duration-300 hover:-translate-y-2">
                  <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center mb-6 mx-auto">
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-[#1A1F2C]">{card.title}</h3>
                  <p className="text-[#1A1F2C]/80 mb-6">{card.description}</p>
                  <ul className="space-y-2">
                    {card.benefits.map((benefit, i) => <li key={i} className="flex items-center text-[#1A1F2C]/80">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-[#2AC20E]" />
                        {benefit}
                      </li>)}
                  </ul>
                </div>)}
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-[#1A1F2C] mb-6">How We Help</h2>
            <p className="text-lg text-[#1A1F2C]/80 max-w-3xl mx-auto mb-12">
              Our platform offers tools and resources designed to support mental wellbeing through various interactive features.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
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
          </section>

          {/* Testimonials Section - Inspired by Ahead app */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-[#1A1F2C] mb-12">What Our Users Say</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((item, index) => <div key={index} className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl relative">
                  <div className="absolute -top-6 -right-6 w-12 h-12 flex items-center justify-center text-2xl">
                    <div className="w-12 h-12 bg-[#3DFDFF] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-lg">{item.emoji}</span>
                    </div>
                  </div>
                  <p className="text-[#1A1F2C] italic mb-6">"{item.quote}"</p>
                  <p className="text-[#1A1F2C]/80 font-semibold">{item.author}</p>
                </div>)}
            </div>
          </section>

          {/* CTA Section */}
          <div className="max-w-3xl mx-auto bg-white/20 backdrop-blur-md rounded-2xl p-10 shadow-xl border border-white/20 relative">
            {/* Decorative emoji for the CTA */}
            <div className="absolute -top-8 -right-8 w-16 h-16 emoji z-10">
              <div className="w-16 h-16 bg-[#FF8A48] rounded-full flex items-center justify-center shadow-lg">
                <Lightbulb className="w-9 h-9 text-white" />
              </div>
            </div>
            
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

      {/* MindVincible branding */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-[#1A1F2C]/70 font-medium z-10">
        MindVincible © {new Date().getFullYear()}
      </div>
    </div>;
};
export default Index;