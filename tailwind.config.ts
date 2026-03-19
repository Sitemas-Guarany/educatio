import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Paleta oficial baseada na bandeira do Ceará
      colors: {
        ceara: {
          verde:       "#006847", // verde da bandeira
          "verde-mid": "#008A5C",
          "verde-light":"#D4EDE4",
          amarelo:     "#F5C800", // amarelo/ouro
          "amarelo-light":"#FEF5C3",
          azul:        "#003082", // azul escuro
          "azul-mid":  "#1A4BA0",
          "azul-light":"#D6E1F5",
          branco:      "#FFFFFF",
          sol:         "#F0A500", // laranja-dourado do sol
        },
        // Semânticos do app
        success: "#006847",
        warning: "#F5C800",
        danger:  "#C0392B",
        info:    "#003082",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body:    ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
      },
      animation: {
        "fade-up":  "fade-up 0.4s ease-out both",
        "scale-in": "scale-in 0.3s ease-out both",
        shimmer:    "shimmer 2s linear infinite",
        pulse2:     "pulse2 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
