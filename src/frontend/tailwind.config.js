/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F3F5F0',
        card: '#FFFFFF',
        'card-soft': '#F3F5F0',
        primary: '#F6DCDD',
        'primary-hover': '#EFC8CB',
        'accent-green': '#C2D3AF',
        'text-main': '#464742',
        'text-secondary': '#66625E',
        border: '#E6E6E0',
        'input-bg': '#FFFFFF',
        error: '#D96C6C',
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '28px',
      },
    },
  },
}

