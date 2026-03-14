import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0b0f1a",
        ink: "#121826",
        tide: "#1b2a41",
        frost: "#f5f7ff",
        neon: "#7cffb2",
        ember: "#ff7a68",
        haze: "#b8c0ff"
      },
      boxShadow: {
        glow: "0 0 40px rgba(124, 255, 178, 0.35)",
        soft: "0 15px 45px rgba(11, 15, 26, 0.45)"
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at 15% 20%, rgba(124, 255, 178, 0.22), transparent 35%), radial-gradient(circle at 80% 15%, rgba(255, 122, 104, 0.2), transparent 40%), radial-gradient(circle at 70% 80%, rgba(184, 192, 255, 0.18), transparent 45%)"
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"]
      },
      animation: {
        float: "float 10s ease-in-out infinite",
        rise: "rise 0.8s ease-out both"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
