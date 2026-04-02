import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // AlignUI design tokens mapped to CSS variables
        primary: {
          50:  'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          950: 'var(--color-primary-950)',
        },
        neutral: {
          0:   '#ffffff',
          50:  'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
          950: 'var(--color-neutral-950)',
        },
        success: {
          50:  'var(--color-success-50)',
          100: 'var(--color-success-100)',
          200: 'var(--color-success-200)',
          300: 'var(--color-success-300)',
          400: 'var(--color-success-400)',
          500: 'var(--color-success-500)',
          600: 'var(--color-success-600)',
          700: 'var(--color-success-700)',
          800: 'var(--color-success-800)',
          900: 'var(--color-success-900)',
          950: 'var(--color-success-950)',
        },
        error: {
          50:  'var(--color-error-50)',
          100: 'var(--color-error-100)',
          200: 'var(--color-error-200)',
          300: 'var(--color-error-300)',
          400: 'var(--color-error-400)',
          500: 'var(--color-error-500)',
          600: 'var(--color-error-600)',
          700: 'var(--color-error-700)',
          800: 'var(--color-error-800)',
          900: 'var(--color-error-900)',
          950: 'var(--color-error-950)',
        },
        warning: {
          50:  'var(--color-warning-50)',
          500: 'var(--color-warning-500)',
          600: 'var(--color-warning-600)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0px 1px 2px 0px rgba(10, 13, 20, 0.03)',
        'sm': '0px 1px 2px 0px rgba(10, 13, 20, 0.06), 0px 1px 3px 0px rgba(10, 13, 20, 0.10)',
        'md': '0px 2px 4px -1px rgba(10, 13, 20, 0.06), 0px 4px 6px -1px rgba(10, 13, 20, 0.10)',
        'lg': '0px 4px 6px -2px rgba(10, 13, 20, 0.05), 0px 10px 15px -3px rgba(10, 13, 20, 0.10)',
        'xl': '0px 10px 10px -5px rgba(10, 13, 20, 0.04), 0px 20px 25px -5px rgba(10, 13, 20, 0.10)',
      },
      borderRadius: {
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '10': '2.5rem',
        '20': '5rem',
      },
    },
  },
  plugins: [],
}

export default config
