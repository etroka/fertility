/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Organic Neutrals
        paper: '#F9F6F1',
        stone: {
          50: '#F5F3F0',
          100: '#E8E4DD',
          200: '#D4CEC3',
          300: '#BCB3A4',
          400: '#A39788',
          500: '#8A7D6D',
          600: '#6F6456',
          700: '#544C41',
          800: '#3A342C',
          900: '#221E18',
        },
        clay: {
          50: '#F7F2ED',
          100: '#EBE1D6',
          200: '#D9C9B8',
          300: '#C4AE97',
          400: '#AC9278',
          500: '#91765A',
          600: '#755D46',
          700: '#584534',
          800: '#3C2E23',
          900: '#221A14',
        },
        // Vitality Gradients
        vitality: {
          dawn: '#FFE5D9',
          blush: '#FECACA',
          coral: '#FB7185',
          ember: '#F97316',
        },
        flow: {
          mist: '#E0F2FE',
          sky: '#BAE6FD',
          ocean: '#38BDF8',
          deep: '#0284C7',
        },
        harmony: {
          sage: '#D1FAE5',
          mint: '#A7F3D0',
          forest: '#34D399',
          earth: '#059669',
        },
      },
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading-xl': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-lg': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading-md': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        'body': ['1rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.03em' }],
      },
      backgroundImage: {
        'gradient-mesh': 'radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.15) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.15) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.15) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 0.15) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 0.15) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 0.15) 0px, transparent 50%), radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 0.15) 0px, transparent 50%)',
        'gradient-vitality': 'linear-gradient(135deg, #FFE5D9 0%, #FECACA 50%, #FB7185 100%)',
        'gradient-flow': 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 50%, #38BDF8 100%)',
        'gradient-harmony': 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 50%, #34D399 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-lg': '0 12px 48px 0 rgba(31, 38, 135, 0.12)',
        'glow': '0 0 20px rgba(251, 113, 133, 0.3)',
        'glow-blue': '0 0 20px rgba(56, 189, 248, 0.3)',
        'glow-green': '0 0 20px rgba(52, 211, 153, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
