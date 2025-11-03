/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Mode Palette
        primary: {
          100: '#E0F7F5',
          300: '#80B3FF', // Keeping existing shades for consistency if not specified
          400: '#4D94FF', // Keeping existing shades for consistency if not specified
          500: '#00C1B0',
          700: '#00418A', // Keeping existing shades for consistency if not specified
        },
        'bg-page': '#F8F9FA',
        'bg-surface': '#FFFFFF',
        'text-primary': '#1A202C',
        'text-secondary': '#4A5568',
        'border-subtle': '#E2E8F0',
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',

        // Dark Mode Palette
        dark: {
          'bg-page': '#111827',
          'bg-surface': '#1F2937',
          'text-primary': '#F9FAFB',
          'text-secondary': '#9CA3AF',
          'border-subtle': '#374151',
          success: '#4ADE80',
          warning: '#FBBF24',
          error: '#F87171',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 87, 183, 0.08), 0 1px 3px rgba(0, 87, 183, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 87, 183, 0.12), 0 2px 6px rgba(0, 87, 183, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
