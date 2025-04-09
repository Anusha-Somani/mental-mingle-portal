
// This is a code snippet to show what needs to be added to your tailwind.config.ts

// Add these to the keyframes section in your tailwind.config.ts
const waveKeyframes = {
  wave1: {
    "0%": { transform: "translate3d(-90px, 0, 0)" },
    "100%": { transform: "translate3d(85px, 0, 0)" },
  },
  wave2: {
    "0%": { transform: "translate3d(-90px, 0, 0)" },
    "100%": { transform: "translate3d(85px, 0, 0)" },
  },
  wave3: {
    "0%": { transform: "translate3d(-90px, 0, 0)" },
    "100%": { transform: "translate3d(85px, 0, 0)" },
  },
  wave4: {
    "0%": { transform: "translate3d(-90px, 0, 0)" },
    "100%": { transform: "translate3d(85px, 0, 0)" },
  },
  float: {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-10px)" },
  },
};

// Add these to the animation section in your tailwind.config.ts
const waveAnimations = {
  "wave1": "wave1 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite",
  "wave2": "wave2 5s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite",
  "wave3": "wave3 3s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite",
  "wave4": "wave4 2s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite",
  "float": "float 6s ease-in-out infinite",
};

// For reference, the colors used are:
const appColors = {
  // Main app colors
  primary: "#FF8A48", // Orange
  secondary: "#D5D5F1", // Light purple
  tertiary: "#3DFDFF", // Cyan
  accent: "#F5DF4D", // Yellow
  highlight: "#FC68B3", // Pink
  success: "#2AC20E", // Green
};
