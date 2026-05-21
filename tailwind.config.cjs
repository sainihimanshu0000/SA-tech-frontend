module.exports = {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'agro': {
          'primary': '#2E7D32',
          'primary-light': '#81C784',
          'accent': '#FBC02D',
          'background': '#F1F8E9',
          'dark': '#1B5E20',
          'gray': '#F5F5F5',
          'error': '#D32F2F'
        }
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif']
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slideIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        slideIn: {
          'from': { transform: 'translateX(-10px)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' }
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' }
        }
      },
      boxShadow: {
        'soft': '0 4px 6px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 8px rgba(46, 125, 50, 0.1)',
        'hover': '0 8px 16px rgba(46, 125, 50, 0.15)'
      }
    },
  },
  plugins: [],
}
