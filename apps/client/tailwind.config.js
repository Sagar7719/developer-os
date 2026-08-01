/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: 'hsl(265, 85%, 60%)',
          cyan: 'hsl(188, 95%, 50%)',
        },
        dark: {
          bg: '#09090b',
          card: '#121215',
          border: 'rgba(255, 255, 255, 0.08)',
        },
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
};
