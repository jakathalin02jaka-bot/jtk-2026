import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Brand neon palette
        purple: {
          DEFAULT: '#7C3AED',
          glow: 'rgba(124, 58, 237, 0.5)',
        },
        cyan: {
          DEFAULT: '#06B6D4',
          glow: 'rgba(6, 182, 212, 0.5)',
        },
        pink: {
          DEFAULT: '#EC4899',
          glow: 'rgba(236, 72, 153, 0.5)',
        },
        // Surface
        surface: {
          0: '#0a0a0f',
          1: '#0f0f17',
          2: '#15151f',
          3: '#1c1c28',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'mesh-shift': 'mesh-shift 18s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float-bob': 'float-bob 4s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'mesh-shift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':       { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%':       { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.4), 0 0 40px rgba(124, 58, 237, 0.2)' },
          '50%':      { boxShadow: '0 0 30px rgba(124, 58, 237, 0.7), 0 0 60px rgba(124, 58, 237, 0.4)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float-bob': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%':   { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2)',   opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
