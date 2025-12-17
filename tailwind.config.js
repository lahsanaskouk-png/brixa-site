module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B0E11',
        card: '#151A1F',
        border: '#2A2E39',
        primary: {
          yellow: '#FCD535',
          green: '#0ECB81',
          red: '#F6465D'
        },
        text: {
          primary: '#EAECEF',
          muted: '#848E9C'
        }
      },
      fontFamily: {
        'arabic': ['Cairo', 'sans-serif']
      },
      direction: {
        'rtl': 'rtl'
      }
    },
  },
  plugins: [],
}
