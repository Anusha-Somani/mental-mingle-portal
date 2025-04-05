
import React from "react";
import BackgroundWithEmojis from "./components/BackgroundWithEmojis";
import { Button } from "./components/ui/button";

const DemoPage: React.FC = () => {
  return (
    <BackgroundWithEmojis>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            M(in)dvincible
          </h1>
          <p className="text-xl text-white/90 mb-8">
            An interactive demo of the animated waves and floating emoji components.
          </p>
          <Button 
            className="bg-[#FC68B3] hover:bg-[#FC68B3]/80 text-white px-8 py-6 text-lg rounded-full"
          >
            Get Started
          </Button>
        </div>
        
        <div className="mt-20 max-w-4xl mx-auto bg-white/20 backdrop-blur-md p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-4">
            Component Features
          </h2>
          <ul className="space-y-2 text-white/90">
            <li>• Animated wave background with customizable colors</li>
            <li>• Floating emoji icons with configurable positions and animations</li>
            <li>• Gradient background with animated blob effects</li>
            <li>• Glassmorphism card styles</li>
            <li>• Responsive design that works on all screen sizes</li>
          </ul>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default DemoPage;
