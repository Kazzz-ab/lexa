/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Source Serif 4', 'Georgia', 'serif'],
      },
      colors: {
        primary: { DEFAULT: '#1B3A6B', light: '#2E5FA3' },
        accent: '#C9A84C',
      },
      boxShadow: {
        card: '0 2px 12px rgba(27,58,107,0.07)',
        'card-hover': '0 24px 48px rgba(27,58,107,0.18)',
      },
    },
  },
  plugins: [],
};
