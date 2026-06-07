import type { Config } from "tailwindcss";

/**
 * Бренд-палитра AquaCore: голубой/циан (#38bdf8 → #0369a1),
 * primary HSL 199 89% 48%, радиус 0.75rem — синхронизировано с самим продуктом.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        ink: {
          DEFAULT: "#0b1220",
          soft: "#1e293b",
          muted: "#64748b",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        brand: "0 20px 60px -20px rgba(2, 132, 199, 0.45)",
        card: "0 10px 40px -12px rgba(15, 23, 42, 0.12)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)",
        "hero-radial":
          "radial-gradient(1200px 600px at 80% -10%, rgba(56,189,248,0.25), transparent 60%), radial-gradient(900px 500px at 0% 10%, rgba(3,105,161,0.18), transparent 55%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
