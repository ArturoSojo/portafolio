import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
