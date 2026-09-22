/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f1',
          100: '#dbecde',
          200: '#b8d9be',
          300: '#8bbf97',
          400: '#5a9d6e',
          500: '#3a8053',
          600: '#2a6640',
          700: '#1f512f',
          800: '#173f25',
          900: '#0f2b19',
          950: '#08180e',
        },
        cream: {
          50: '#fdfcf8',
          100: '#faf6ec',
          200: '#f4ecd4',
          300: '#ebdcb0',
        },
        beige: {
          50: '#faf8f4',
          100: '#f3eee2',
          200: '#e7dcc6',
          300: '#d8c9a3',
        },
        amber: {
          accent: '#f5a623',
          deep: '#d4881a',
        },
        charcoal: {
          700: '#2a2a28',
          800: '#1e1e1c',
          900: '#131312',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      maxWidth: {
        '8xl': '88rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};
