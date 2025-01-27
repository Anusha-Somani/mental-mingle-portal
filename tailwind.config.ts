import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2A9D8F", // Sea green
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F4A261", // Warm yellow/orange
          foreground: "#1A1A1A",
        },
        accent: {
          DEFAULT: "#E9C46A", // Soft yellow
          foreground: "#1A1A1A",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        wave1: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-25%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        wave2: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-20%)" },
          "100%": { transform: "translateX(-40%)" },
        },
        wave3: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-15%)" },
          "100%": { transform: "translateX(-30%)" },
        },
        wave4: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(-20%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "wave1": "wave1 15s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite",
        "wave2": "wave2 20s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite",
        "wave3": "wave3 25s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite",
        "wave4": "wave4 30s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;