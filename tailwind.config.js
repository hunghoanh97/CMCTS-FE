/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cmc-blue': '#001253',
        'cmc-sky': '#00B4D8',
        'cmc-gray': '#F5F5F5',
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.mask-composite-exclude': {
          '-webkit-mask-composite': 'source-out',
          'mask-composite': 'exclude',
        }
      })
    }
  ],
}
