/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neu: {
          bg: '#e0e5ec',
          text: '#7a8599',
          textDark: '#4a5568',
          accent: '#4299e1', 
          accentHover: '#3182ce',
          red: '#fc8181',
          green: '#68d391',
          yellow: '#f6ad55',
        }
      },
      boxShadow: {
        'neu-outer': '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
        'neu-outer-hover': '12px 12px 20px rgb(163,177,198,0.7), -12px -12px 20px rgba(255,255,255, 0.6)',
        'neu-outer-active': 'inset 6px 6px 10px 0 rgba(163,177,198, 0.7), inset -6px -6px 10px 0 rgba(255,255,255, 0.6)',
        'neu-inner': 'inset 6px 6px 10px 0 rgba(163,177,198, 0.5), inset -6px -6px 10px 0 rgba(255,255,255, 0.6)',
      }
    },
  },
  plugins: [],
}
