import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Base */
        'bg-app': '#F0F2F5',
        'bg-card': '#FFFFFF',
        'bg-input': '#F7F8FA',

        /* Brand */
        'brand': {
          primary: '#1B4FD8',
          secondary: '#EEF2FF',
          600: '#2563eb',
          500: '#3b82f6',
          400: '#60a5fa',
        },

        /* Text */
        'text': {
          primary: '#0D1117',
          secondary: '#6B7280',
          hint: '#9CA3AF',
          muted: '#4a6885',
        },

        /* Semantic */
        'success': {
          500: '#10b981',
          400: '#34d399',
        },
        'danger': {
          500: '#ef4444',
          400: '#f87171',
        },
        'warning': '#F59E0B',
        'amber': {
          400: '#fbbf24',
          500: '#F59E0B',
        },

        /* Borders */
        'border': '#E5E7EB',
        'border-focus': '#1B4FD8',

        /* Legacy dark theme support */
        'navy': {
          950: '#060d1f',
          900: '#0a1628',
          800: '#0f1f3d',
          700: '#162947',
          600: '#1e3557',
          500: '#2a4a73',
          400: '#3d6494',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Inter', 'monospace'],
      },
      fontSize: {
        xs: ['13px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '1.5' }],
        base: ['16px', { lineHeight: '1.6' }],
        lg: ['18px', { lineHeight: '1.6' }],
        xl: ['20px', { lineHeight: '1.6' }],
        '2xl': ['24px', { lineHeight: '1.3' }],
        '3xl': ['30px', { lineHeight: '1.2' }],
        '4xl': ['36px', { lineHeight: '1.2' }],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
        xl: '20px',
        md: '12px',
        sm: '8px',
      },
      spacing: {
        card: '24px',
      },
      height: {
        input: '52px',
        button: '52px',
      },
      boxShadow: {
        cards: '0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04)',
        elevated: '0 8px 32px rgba(0, 0, 0, 0.12)',
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      },
      backdropFilter: {
        'blur-md': 'blur(20px)',
        'blur-sm': 'blur(8px)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'checkmark': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'orb-drift': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(40px, -30px) scale(1.1)' },
        },
        'page-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'checkmark': 'checkmark 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'orb-drift': 'orb-drift 12s ease-in-out infinite alternate',
        'page-in': 'page-in 0.3s ease-out forwards',
        'shake': 'shake 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
