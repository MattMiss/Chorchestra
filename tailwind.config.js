
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Include the app directory for Expo Router
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./types/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        transparent50: 'rgba(0, 0, 0, 0.5)',
        transparent70: 'rgba(0, 0, 0, 0.7)',
        primary: '#F7FAFF',
        secondary: '#858E9F',
        accent:'#14A8CC',
        dark: '#121315',
        medium: '#1C1F26',
        popup: '#28282c',
        statusBar: '#0B0B0D',
        buttonPrimary: '#14A8CC',
        buttonSecondary: '#6d767c',
        buttonAlternative: '#F5103B',
        tagDefault: '#7e7e7e',
        sectionTitle: 'rgba(203,237,245,0.59)',
      }
    },
    keyframes: {
      shake: {
        '0%, 100%': { transform: 'translateX(0)' },
        '25%': { transform: 'translateX(-5px)' },
        '75%': { transform: 'translateX(5px)' },
      },
    },
    animation: {
      shake: 'shake 0.5s infinite',
    },
  },
  plugins: [],
};
