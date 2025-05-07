/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        pgreen: {
          50: '#e9f5e7',
          100: '#d3ebce',
          200: '#a7d89c',
          300: '#7bc469',
          400: '#5ca14a', // Color base
          500: '#4e8b3f',
          600: '#3f7333',
          700: '#335d2a',
          800: '#284822',
          900: '#1d3419',
        }
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
