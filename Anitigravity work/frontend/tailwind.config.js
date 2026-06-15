/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0C10",
        darkCard: "#17181F",
        darkBorder: "#242630",
        accent: "var(--color-accent)",
        accentGlow: "var(--color-accent-glow)",
        accentBorder: "var(--color-accent-border)",
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulseGlow 2.5s infinite alternate',
        'spin-slow': 'spin 6s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%': { boxShadow: '0 0 5px var(--color-accent-glow)' },
          '100%': { boxShadow: '0 0 20px var(--color-accent-glow)' },
        }
      }
    },
  },
  plugins: [],
}
