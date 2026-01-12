/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#14B8A6',
        secondary: '#84CC16',
        accent: '#FB7185',
      },
    },
  },
  plugins: [],
}
