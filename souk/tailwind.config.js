/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      colors: {
        brand: {
          50:  '#fdf3ee',
          100: '#fae3d2',
          200: '#f4c4a1',
          300: '#ec9c68',
          400: '#e27038',
          500: '#d4581a',
          600: '#b84414',
          700: '#963412',
          800: '#792b14',
          900: '#622614',
        },
        sand: {
          50:  '#faf8f4',
          100: '#f7f5f0',
          200: '#edeae2',
          300: '#e2ded5',
          400: '#c8c4ba',
          500: '#a09d98',
          600: '#6b6860',
          700: '#4a4844',
          800: '#2a2925',
          900: '#1a1814',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 2px 16px rgba(26,24,20,.08)',
        'card-hover': '0 12px 32px rgba(26,24,20,.13)',
        soft: '0 8px 40px rgba(26,24,20,.10)',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        shimmer: 'shimmer 1.6s infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
      },
    },
  },
  plugins: [],
}
