/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: { DEFAULT: '#4C1D95', light: '#7C3AED' },
        accent: '#8B5CF6',
      },
      boxShadow: {
        card: '0 2px 12px rgba(76,29,149,0.07)',
        'card-hover': '0 24px 48px rgba(76,29,149,0.18)',
      },
    },
  },
  plugins: [],
};
