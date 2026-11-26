/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brand palette — dark blue/navy + electric blue/cyan
                brand: {
                    50:  '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                    // Semantic aliases used as bg-brand-dark, text-brand-blue etc.
                    dark: '#080c14',
                    blue: '#2563eb',
                    cyan: '#06b6d4',
                },
                surface: {
                    DEFAULT: '#080c14',
                    50:  '#0d1420',   // lightest elevated surface
                    100: '#111827',   // card background
                    200: '#1a2234',   // slightly elevated
                    300: '#c8d6e8',   // readable text — labels, secondary headings
                    400: '#94a3b8',   // muted text — sublabels
                    500: '#64748b',   // faintest readable text — captions
                    600: '#1e2d3d',   // border colour, subtle dividers
                    700: '#151f2e',   // darker surface / step connectors
                    800: '#0f1623',   // dark input / field background
                    900: '#080c14',   // page background
                },
                // Accent cyan
                accent: {
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Work Sans', 'system-ui', '-apple-system', 'sans-serif'],
                display: ['Work Sans', 'Inter', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.3) 0%, transparent 60%)',
                'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)',
            },
            animation: {
                'fade-in':  'fadeIn 0.4s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 3s linear infinite',
                'float': 'floatY 4s ease-in-out infinite',
                'glow': 'glowPulse 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn:   { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                slideUp:  { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                floatY:   { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
                glowPulse: { '0%, 100%': { opacity: '0.5' }, '50%': { opacity: '1' } },
            },
            boxShadow: {
                'glow-blue': '0 0 40px -10px rgba(37, 99, 235, 0.5)',
                'glow-cyan': '0 0 30px -10px rgba(6, 182, 212, 0.4)',
                'card':      '0 1px 3px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)',
                'card-hover':'0 2px 8px rgba(0,0,0,0.6), 0 16px 48px rgba(0,0,0,0.4)',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
