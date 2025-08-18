// tailwind.config.js
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js" // Ensure this path is correct
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;








