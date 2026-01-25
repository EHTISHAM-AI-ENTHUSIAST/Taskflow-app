/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00d9ff',
        secondary: '#7c3aed',
        dark: {
          100: '#1e293b',
          200: '#0f172a',
          300: '#0d1117',
        }
      }
    },
  },
  plugins: [],
}
