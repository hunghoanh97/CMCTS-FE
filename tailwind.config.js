/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cmc-blue': '#0065B2',
        'cmc-sky': '#00AEEF',
        'cmc-gray': '#F4F4F4',
      }
    },
  },
  plugins: [],
}
