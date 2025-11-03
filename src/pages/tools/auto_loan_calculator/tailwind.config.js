/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/pages/tools/**/*.{js,ts,jsx,tsx}",
    "src/components/calculators_shared_files/all_rates/all_rates-old.html",
  ],
  safelist: [
    'text-h1',
    'text-h2',
    'text-h3',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#E0F7F5',
          500: '#00C1B0',
          700: '#008A7E',
        },
        neutral: {
          50: '#F8F9FB',
          100: '#FFFFFF',
          400: '#697586',
          900: '#1D2939',
        },
        semantic: {
          success: '#12B76A',
          warning: '#F79009',
          error: '#F04438',
        },
        'bg-page': '#F8F9FB',
        'bg-surface': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h1: ['192px', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['36px', { lineHeight: '1.4', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
}
