/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Align with site-wide white/teal scheme (Buy vs Lease)
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
        // Surface tokens
        'bg-page': '#F8F9FB',
        'bg-surface': '#FFFFFF',

        // Dark mode tokens to match other tools
        'dark-bg-page': '#111827',
        'dark-bg-surface': '#1F2937',
        'dark-text-primary': '#F9FAFB',
        'dark-text-secondary': '#9CA3AF',
        'dark-border-subtle': '#374151',
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 87, 183, 0.08), 0 1px 3px rgba(0, 87, 183, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 87, 183, 0.12), 0 2px 6px rgba(0, 87, 183, 0.08)',
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
