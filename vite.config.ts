import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  theme: {
  extend: {
    // ...
  },
},
  plugins: [
    tailwindcss(),
  ],
  extend: {
  animation: {
    'fade-in-down': 'fadeInDown 0.3s ease-out',
  },
  keyframes: {
    fadeInDown: {
      '0%': { opacity: 0, transform: 'translateY(-10px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
  },
},
})