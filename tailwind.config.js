/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fantasy: {
          gold: '#D4AF37',
          bronze: '#CD7F32',
          silver: '#C0C0C0',
          crimson: '#DC143C',
          midnight: '#191970',
          forest: '#228B22',
          parchment: '#F4E4BC',
          shadow: '#2C2C2C',
        }
      },
      fontFamily: {
        fantasy: ['Cinzel', 'serif'],
        adventure: ['Merriweather', 'serif'],
      },
      animation: {
        'dice-roll': 'diceRoll 0.6s ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        diceRoll: {
          '0%': { transform: 'rotateX(0) rotateY(0)' },
          '50%': { transform: 'rotateX(180deg) rotateY(180deg)' },
          '100%': { transform: 'rotateX(360deg) rotateY(360deg)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      backgroundImage: {
        'parchment': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJwYXJjaG1lbnQiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI0Y0RTRCQyIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxLjUiIGZpbGw9IiNFNkQ3QUEiIG9wYWNpdHk9IjAuMyIvPgo8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXJjaG1lbnQpIi8+Cjwvc3ZnPg==')",
      }
    },
  },
  plugins: [],
}