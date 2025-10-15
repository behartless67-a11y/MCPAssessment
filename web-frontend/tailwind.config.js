/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        uva: {
          blue: '#232D4B',
          orange: '#E57200',
          cyan: '#009FDF',
          yellow: '#FDDA24',
        },
      },
    },
  },
  plugins: [],
}
