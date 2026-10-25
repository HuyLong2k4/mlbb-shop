import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Navy / Midnight Blue theme
        navy: {
          950: "#060a17", // Ultra deep background
          900: "#0b132b", // Main base dark blue
          850: "#0f1b3d", // Elevated card / section background
          800: "#14234f", // Secondary surface
          700: "#1d326f", // Border highlight & hover
          600: "#27428f", // Accent blue
        },
        // eSports Metallic Gold theme
        gold: {
          300: "#fef08a",
          400: "#fde047",
          500: "#eab308", // Vivid gold
          600: "#ca8a04", // Metallic gold
          700: "#a16207", // Dark bronze gold
          glow: "#ffdf00",
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #FFDE59 0%, #FF914D 100%)",
        "gold-metallic": "linear-gradient(110deg, #ca8a04 0%, #fef08a 35%, #eab308 60%, #a16207 100%)",
        "navy-radial": "radial-gradient(circle at top, #14234f 0%, #060a17 80%)",
        "esports-grid": "radial-gradient(circle, rgba(234, 179, 8, 0.08) 1px, transparent 1px)",
      },
      boxShadow: {
        "gold-sm": "0 0 10px rgba(234, 179, 8, 0.25)",
        "gold-md": "0 0 20px rgba(234, 179, 8, 0.35)",
        "gold-lg": "0 0 35px rgba(234, 179, 8, 0.45)",
        "navy-card": "0 8px 30px rgba(6, 10, 23, 0.8)",
      },
      fontFamily: {
        sans: ["var(--font-rajdhani)", "var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
