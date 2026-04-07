/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eefcf3',
          100: '#d6f7e3',
          200: '#b0edcb',
          300: '#7bde9f',
          400: '#43c771',
          500: '#1daa52',
          600: '#118941',
          700: '#0e6d36',
          800: '#0e572d',
          900: '#0c4826',
          950: '#062812',
        },
        surface: {
          DEFAULT: '#0f1117',
          card: '#161b27',
          border: '#1e2535',
          muted: '#2a3347',
        },
        text: {
          primary: '#f0f4ff',
          secondary: '#8b9abf',
          muted: '#515e7a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #1daa52 0%, #0e6d36 100%)',
      },
      boxShadow: {
        'glow-brand': '0 0 20px rgba(29, 170, 82, 0.25)',
        'glow-sm': '0 0 10px rgba(29, 170, 82, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
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
      },
    },
  },
  plugins: [],
};
