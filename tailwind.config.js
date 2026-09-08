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
        weekday: {
          bg: '#FAF8F2',
          card: '#FBF9F4',
          border: 'rgba(20, 20, 20, 0.1)',
          primary: '#186750',
          'primary-hover': '#134e3d',
          dark: '#141414',
          muted: '#757472',
          yellow: '#FFC600',
          accent: '#0d9488',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Lato', 'sans-serif'],
        serif: ['Merriweather', 'Garamond', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
};