import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Aptos", "Space Grotesk", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        panel: "0 24px 70px -38px rgba(15, 23, 42, 0.45)"
      }
    }
  },
  plugins: []
} satisfies Config;
