import type {Config} from 'tailwindcss';

const { fontFamily } = require("tailwindcss/defaultTheme")

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        display: ['var(--font-display)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
          '6': 'hsl(var(--chart-6))',
        },
        'cyber-black': '#050505',
        'cyber-gray': '#0A0A0C',
        'cyber-subtle': '#121214',
        'neon-cyan': '#00F0FF',
        'neon-purple': '#BC13FE',
        'neon-yellow': '#FFD700',
        'neon-red': '#FF003C',
        'neon-green': '#00FF88',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px hsl(var(--primary) / 0.4)',
          },
          '50%': {
            opacity: '0.8',
            boxShadow: '0 0 40px hsl(var(--primary) / 0.6)',
          },
        },
        'sound-wave': {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
        'pulse-fast': {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.5' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'sound-wave': 'sound-wave 1.2s infinite ease-in-out',
        'pulse-fast': 'pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      dropShadow: {
        'glow-primary': '0 0 10px hsl(var(--primary))',
        'glow-chart-1': '0 0 10px hsl(var(--chart-1))',
        'glow-chart-2': '0 0 10px hsl(var(--chart-2))',
        'glow-chart-3': '0 0 10px hsl(var(--chart-3))',
        'glow-chart-4': '0 0 10px hsl(var(--chart-4))',
        'glow-chart-5': '0 0 10px hsl(var(--chart-5))',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
