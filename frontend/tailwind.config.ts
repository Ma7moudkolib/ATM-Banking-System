import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060d1f',
          900: '#0a1628',
          800: '#0f1f3d',
          700: '#162947',
          600: '#1e3557',
          500: '#2a4a73',
          400: '#3d6494',
        },
        brand: {
          600: '#2563eb',
          500: '#3b82f6',
          400: '#60a5fa',
        },
        success: {
          500: '#10b981',
          400: '#34d399',
        },
        danger: {
          500: '#ef4444',
          400: '#f87171',
        },
        amber: {
          400: '#fbbf24',
        },
        text: {
          primary: '#f0f6ff',
          secondary: '#8ba8cc',
          muted: '#4a6885',
        },
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropFilter: {
        'blur-md': 'blur(20px)',
        'blur-sm': 'blur(8px)',
      },
      keyframes: {
        'orb-drift': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(40px, -30px) scale(1.1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'page-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        'btn-ripple': {
          '0%': { boxShadow: '0 0 0 0 rgba(96, 165, 250, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(96, 165, 250, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(96, 165, 250, 0)' },
        },
      },
      animation: {
        'orb-drift': 'orb-drift 12s ease-in-out infinite alternate',
        shimmer: 'shimmer 1.5s infinite',
        'page-in': 'page-in 0.3s ease-out forwards',
        shake: 'shake 0.4s ease-in-out',
        'btn-ripple': 'btn-ripple 0.6s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
