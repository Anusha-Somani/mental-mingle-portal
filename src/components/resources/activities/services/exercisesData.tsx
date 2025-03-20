
import React from "react";
import {
  Power,
  Sparkles,
  Brain,
  BookOpen,
  Music,
  Eye,
  HeartPulse,
  Footprints
} from "lucide-react";
import { Exercise } from "../types/emotionalHackingTypes";

// Define all the emotional hacking exercises
export const exercises: Exercise[] = [
  {
    id: "digital-detox",
    name: "Digital Detox",
    icon: <Power className="h-6 w-6 text-[#FC68B3]" />,
    description: "Give yourself a mental break by unplugging from all electronic devices. Taking a \"vacation\" from screens can help you reset and refocus. Use this time to connect with yourself or the physical world around you.",
    instructions: "Set a timer for 15-30 minutes and put away all electronic devices. Notice how you feel before, during, and after."
  },
  {
    id: "box-breathing",
    name: "Box Breathing",
    icon: <Sparkles className="h-6 w-6 text-[#3DFDFF]" />,
    description: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold again for 4 seconds. This rhythmic breathing pattern can calm your nervous system.",
    instructions: "Imagine tracing a box in the air as you do this breathing exercise. Focus on making each side of the box equal in length."
  },
  {
    id: "free-writing",
    name: "Free Writing",
    icon: <BookOpen className="h-6 w-6 text-[#F5DF4D]" />,
    description: "Take a moment to write down whatever you're feeling. Don't censor yourself, just let the words flow. This can help you process your emotions and clear your mind.",
    instructions: "Write continuously for 5 minutes without stopping or judging what comes out."
  },
  {
    id: "five-senses",
    name: "5-4-3-2-1 Grounding",
    icon: <Brain className="h-6 w-6 text-[#FF8A48]" />,
    description: "Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
    instructions: "Take your time with each sense, really focusing on the details of what you're experiencing."
  },
  {
    id: "music-immersion",
    name: "Music Immersion",
    icon: <Music className="h-6 w-6 text-[#2AC20E]" />,
    description: "Put on your favorite song and really focus on the lyrics, beats, or instruments. Try to hum along or tap your fingers to the rhythm.",
    instructions: "Close your eyes while listening to increase your focus on the auditory experience."
  },
  {
    id: "sensory-focus",
    name: "Sensory Focus",
    icon: <Eye className="h-6 w-6 text-[#D5D5F1]" />,
    description: "Pop a piece of gum or a mint in your mouth and focus on the flavor, texture, and how it feels as you chew.",
    instructions: "Notice how the flavor changes over time and how the sensation affects your mood."
  },
  {
    id: "walk-it-out",
    name: "Walk It Out",
    icon: <Footprints className="h-6 w-6 text-[#FC68B3]" />,
    description: "Take a walk, even if it's just around your room. Notice the feeling of your feet hitting the ground. Bonus: Walk barefoot on grass!",
    instructions: "Pay attention to each step and how your body feels as you move."
  },
  {
    id: "color-hunt",
    name: "Color Hunt",
    icon: <Eye className="h-6 w-6 text-[#3DFDFF]" />,
    description: "Pick a color and find 5 things around you that match it. This distracts your brain and brings you back to the present.",
    instructions: "Choose a different color each time you practice this exercise."
  },
  {
    id: "memory-rewind",
    name: "Memory Rewind",
    icon: <Brain className="h-6 w-6 text-[#F5DF4D]" />,
    description: "Think of a happy or funny memory and walk yourself through the details—what were you wearing? Who was there? What did it smell like?",
    instructions: "Try to engage all your senses as you recall this positive memory."
  }
];
