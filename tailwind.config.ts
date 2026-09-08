import type { Config } from "tailwindcss";

// Escala de opacidad completa (0-100 de uno en uno): las landings de proyecto usan
// muchos valores intermedios (bg-white/8, border-white/12…) que la escala por
// defecto de Tailwind 3 no cubre y que, si faltan, se descartan en silencio.
const opacity = Object.fromEntries(
  Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)])
);

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      opacity,
      colors: {
        secondary: "#00d2ff",
        darkBg: "#132124",
      },
      backgroundImage: {
        "gradient-cover":
          "linear-gradient(90.21deg, rgba(15, 19, 48, 1) -5.91%, rgba(60, 129, 186, 1) 111.58%)",
      },
    },
  },
  plugins: [],
};
export default config;
