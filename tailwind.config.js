/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0E11',
        card: '#151A1F',
        border: '#2A2E39',
        primary: '#FCD535', // Gold
        primaryHover: '#E5C02A',
        success: '#0ECB81', // Green
        danger: '#F6465D', // Red
        text: '#EAECEF',
        muted: '#848E9C',
      },
      fontFamily: {
        sans: ['Cairo', 'sans-serif'], // خط عربي جميل
      }
    },
  },
  plugins: [],
}
