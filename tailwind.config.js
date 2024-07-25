/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      gridTemplateColumns: {
        sidebar: "250px minmax(0,1fr)",
        "sidebar-collapsed": "106px auto",
      },
      backgroundColor: {
        main: "var(--background)",
        "main-hover": "hsl(var(--background-hover) / 68%)",
        brand: "hsl(var(--primary-brand))",
        "brand-secondary": "hsl(var(--secondary-brand))"
      },
      backgroundImage: {
        'fondo1': "url('/Fondo1.jpg')",
        'fondo2': "url('/Fondo2.jpg')",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          text: {
            DEFAULT: "hsl(var(--primary-brand-text))",
          },
          primary: {
            DEFAULT: "var(var(--primary-brand))",
            lighter: "var(--primary-brand-lighter)",
            opaque: "hsl(var(--primary-brand-opaque))",
          },
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          brand: "hsl(var(--brand)"
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "shake": {
            "10%, 90%": {
                transform: "translate3d(-1px, 0, 0)"
            },
            "20%, 80%": {
              transform: "translate3d(2px, 0, 0)"
            },
            "30%, 50%, 70%": {
              transform: "translate3d(-4px, 0, 0)"
            },
            "40%, 60%": {
              transform: "translate3d(4px, 0, 0)"
            },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shake": "shake 0.82s cubic-bezier(.36, .07, .19, .97) both"

      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}