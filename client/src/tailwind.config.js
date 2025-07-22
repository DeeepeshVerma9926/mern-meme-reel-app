/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Add inside theme.extend if needed
aspectRatio: {
  '4/5': '4 / 5',
  '9/16': '9 / 16',
},
}

