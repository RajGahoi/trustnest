/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#F8F1E6',
          200: '#F0E4D3',
          300: '#E4D3BC',
        },
        navy: {
          950: '#04151F',
          900: '#073F59',
          800: '#123746',
          700: '#1A4D63',
          600: '#266580',
          100: '#E6F0F5',
        },
        orange: {
          DEFAULT: '#F79A00',
          500: '#F79A00',
          600: '#E08A00',
          700: '#C77A00',
          hover: '#FF9E00',
        },
        amber: {
          DEFAULT: '#FFC45C',
          soft: '#FFE699',
          light: '#FDE8C3',
        },
        trust: {
          green: '#10B981',
          blue: '#2563EB',
          amber: '#F59E0B',
          red: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'trust': '0 20px 40px -15px rgba(7, 63, 89, 0.08)',
        'trust-lg': '0 30px 60px -20px rgba(7, 63, 89, 0.15)',
        'orange-glow': '0 10px 30px -5px rgba(247, 154, 0, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.85, transform: 'scale(1.02)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
