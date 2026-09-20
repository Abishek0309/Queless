/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Surface colors
        "surface": "#FAF8FF",
        "surface-bright": "#FAF8FF",
        "surface-dim": "#D2D9F4",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F2F3FF",
        "surface-container": "#EAEDFF",
        "surface-container-high": "#E2E7FF",
        "surface-container-highest": "#DAE2FD",
        "surface-variant": "#DAE2FD",
        
        // Content on surface
        "on-surface": "#131B2E",
        "on-surface-variant": "#464555",
        "inverse-surface": "#283044",
        "inverse-on-surface": "#EEF0FF",
        
        // Brand & Primary
        "primary": "#3525CD",
        "primary-hover": "#2B1EB3",
        "primary-container": "#4F46E5",
        "on-primary": "#FFFFFF",
        "on-primary-container": "#DAD7FF",
        "primary-fixed": "#E2DFFF",
        "primary-fixed-dim": "#C3C0FF",
        
        // Secondary (Serving / Success / Emerald)
        "secondary": "#006C49",
        "secondary-container": "#6CF8BB",
        "on-secondary": "#FFFFFF",
        "on-secondary-container": "#00714D",
        "emerald-brand": "#10B981",
        
        // Tertiary (Amber / Warning / Almost ready)
        "tertiary": "#684000",
        "tertiary-container": "#885500",
        "on-tertiary": "#FFFFFF",
        "on-tertiary-container": "#FFD4A4",
        "amber-brand": "#F59E0B",
        
        // Error (Crimson / Cancelled / Skipped)
        "error": "#BA1A1A",
        "error-container": "#FFDAD6",
        "on-error": "#FFFFFF",
        "on-error-container": "#93000A",
        "crimson-brand": "#EF4444",
        
        // Outlines
        "outline": "#777587",
        "outline-variant": "#C7C4D8",
        "surface-tint": "#4D44E3",
        "background": "#FAF8FF",
        "on-background": "#131B2E",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        'xs': '0.25rem',
        'sm': '0.375rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)',
        'card': '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.03)',
        'elevated': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'glow-primary': '0 0 20px -5px rgba(79, 70, 229, 0.3)',
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
