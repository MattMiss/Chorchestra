/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Include the app directory for Expo Router
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: {
          50: 'rgba(0, 0, 0, 0.5)',
          70: 'rgba(0, 0, 0, 0.7)'
        }
      }
    },
  },
  plugins: [],
};
