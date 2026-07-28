/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f4f7fb',
          100: '#e8eef5',
          200: '#d0dbe8',
          300: '#a9bbcf',
          400: '#7a93ad',
          500: '#5b7490',
          600: '#475d75',
          700: '#3a4c60',
          800: '#324151',
          900: '#2c3846',
          950: '#1a222d',
        },
        brand: {
          50: '#eff8ff',
          100: '#dbeefe',
          200: '#bfddfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        mist: {
          50: '#f5f8fc',
          100: '#eef3f9',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 18px 50px -28px rgba(26, 34, 45, 0.45)',
        panel: '0 1px 0 rgba(255,255,255,0.7) inset, 0 12px 40px -24px rgba(26,34,45,0.28)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        grow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        rise: 'rise 0.55s ease-out both',
        fade: 'fade 0.4s ease-out both',
        grow: 'grow 0.8s ease-out both',
      },
    },
  },
  plugins: [],
};
